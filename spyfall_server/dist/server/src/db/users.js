"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users = [
    {
        id: "0",
        username: "TheRyaz",
        name: "Ryan",
        email: "ryan.lawson@v-eden.com",
        password: "123456",
    },
    {
        id: "1",
        username: "KristaChan",
        name: "Krista",
        email: "krista.lawson@v-eden.com",
        password: "789890",
    }
];
function getUsers() {
    return users;
}
exports.getUsers = getUsers;
function getUserById(id) {
    return users.find(u => u.id === id);
}
exports.getUserById = getUserById;
function getUserByUsername(username) {
    return users.find(u => u.username === username);
}
exports.getUserByUsername = getUserByUsername;
function addUser(user) {
    return users.push(user);
}
exports.addUser = addUser;
