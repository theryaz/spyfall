"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const users_1 = require("../db/users");
const userType = new graphql_1.GraphQLObjectType({
    name: 'User',
    description: 'Auth user',
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        username: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
    }),
});
const query = {
    users: {
        type: new graphql_1.GraphQLList(userType),
        resolve: (root) => users_1.getUsers()
    },
    userByUsername: {
        type: userType,
        args: {
            username: {
                description: 'find by username',
                type: graphql_1.GraphQLString
            }
        },
        resolve: (root, { username }) => users_1.getUserByUsername(username)
    },
};
const mutation = {
    addUser: {
        type: userType,
        args: {
            username: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        },
        resolve: (obj, input) => users_1.addUser(input)
    },
};
const subscription = {};
exports.UserSchema = {
    query,
    mutation,
    subscription,
    types: [userType]
};
