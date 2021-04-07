const users = []

// AddUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing User
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser){
        return {
            error: 'username is in use!'
        }
    }

    // Store User
    const user = {id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index != -1){
        return users.splice(index, 1)[0]    // users.splice return array hence we are using [0] since we know we are only going to get 1 item
    }

}

const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}

const getUsersInRoom = (room) => {
    // const usersInRoom = []
    // for(let i = 0; i < users.length; i++){
    //     if(users[i].room === room){
    //         usersInRoom.push(users[i])
    //     }
    // }
    // return usersInRoom;

    // OR
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser, 
    removeUser,
    getUser,
    getUsersInRoom
}
