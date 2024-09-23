import { gql } from "apollo-server";

export const addressSchema = gql`
  type Address {
    id:ID!
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
    userId: ID!
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  type Query {
    getAddress(id: ID!): Address
    getAddressesByUser(userId: ID!): [Address]
  }

  type Mutation {
    createAddress(input: AddressInput!): Address
    updateAddress(id: ID!, input: AddressInput!): Address
    deleteAddress(id: ID!): Boolean
  }
`;
