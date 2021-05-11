const { gql } = require("apollo-server-express");

const beer = gql`
    type Beer {
        id: Int!
        name: String!
        brand: String
        price: Float
    }

    extend type Query {
        beer(id: Int!): Beer
        beers(brand: String!): [Beer]
    }
`;

module.exports = beer;
