// userSchema.ts
import { gql } from "apollo-server-express";

export const userSchema = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    age: String!
    email: String!
    password: String
    profilePic: String
    otp: String
    otpExpireDate: String
    isVerified: Boolean!
    isDeleted: Boolean!
    isSuspended: Boolean!
    lastLogin: String
    device: String!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    registerUser(input: RegisterInput!): User
    loginUser(input: LoginInput!): String
  }
`;
