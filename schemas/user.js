const { gql } = require("apollo-server-express");

const user = gql`
    type User {
        id: Int!
        login: String!
    }

    extend type Query {
        current: User,
        users: [User]!
    }

    extend type Mutation {
        register(login: String!, password: String!): String
        login(login: String!, password: String!): String
    }
`;

module.exports = user;
