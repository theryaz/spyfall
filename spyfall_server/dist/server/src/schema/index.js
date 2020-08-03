"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
// Import each models schema
const user_1 = require("./user");
exports.graphqlSchema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: () => Object.assign(user_1.UserSchema.query)
    }),
    mutation: new graphql_1.GraphQLObjectType({
        name: 'Mutation',
        fields: () => Object.assign(user_1.UserSchema.mutation)
    }),
    // subscription: new GraphQLObjectType({
    //     name: 'Subscription',
    //     fields: () => Object.assign(
    //         UserSchema.subscription,
    //     )
    // }),
    types: [
        ...user_1.UserSchema.types,
    ]
});
