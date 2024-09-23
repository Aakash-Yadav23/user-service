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
    addressIds:[ID]
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
    getMe:User

  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    email: String!
    password: String!
  }


  input UpdateUserInput {
    id: ID!
    firstName: String
    lastName: String
    dateOfBirth: String
    age: String
    email: String
    password: String
    profilePic: String
    addressIds:[ID]
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    registerUser(input: RegisterInput!): User
    updateUser(input: UpdateUserInput!): User

    loginUser(input: LoginInput!): String
  }
`;
