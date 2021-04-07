const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
// const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)   // --> Get all css styles
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin      // Total height of message + margin
    
    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of message container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight  // $messages.scrollTop - It gives a number, the amount of distance we have scrolled from top

    if(containerHeight - newMessageHeight <= scrollOffset) {  // If we are at the bottom before last message is added
        $messages.scrollTop = $messages.scrollHeight    // Scroll to bottom
    }

}

socket.on('message', (message) => {      // message is an object
    console.log(message)
    const html = `<div class="message"> <p> <span class="message__name">${message.username}</span> <span class="message__meta">${moment(message.createdAt).format('h:mm a')}</span> </p> <p> ${message.text} </p> </div>`
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (message) => {   //url is an object
    console.log(message)
    const html = `<div class="message"> <p> <span class="message__name">${message.username}</span> <span class="message__meta">${moment(message.createdAt).format('h:mm a')}</span> </p> <p><a href=${message.url} target="_blank"> My current location </a> </p> </div>`
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')    // Disable the form after submitting it

    const message = e.target.elements.message.value            // e.target --> #message-form, e.target.elemets.message --> 'message' element of #message-form
    
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')    // Enable the form
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }

        console.log('message delivered')
    })
})

$sendLocationButton.addEventListener('click', () => {


    if(!navigator.geolocation){
        return alert('Geolocation is not supported by browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')        // Disable Button

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, () =>{
            console.log("Location shared!")
            $sendLocationButton.removeAttribute('disabled')     // Enable Button
        })
    })

    
})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'    // Redirect them to same page
    }
})

