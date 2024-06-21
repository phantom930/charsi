import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUserInfo($email: String!) {
    customer(email: $email) {
      data {
        attributes {
          name
        }
      }
    }
  }
`;

export const GET_PHONE_CODE = gql`
  mutation getPhoneCode($phoneNumber: String!, $channel: String!) {
    getPhoneCode(phoneNumber: $phoneNumber, channel: $channel) {
      success
      message
    }
  }
`;

export const VERIFY_PHONE_CODE = gql`
  mutation verifyPhoneCode($phoneNumber: String!, $code: String!) {
    verifyPhoneCode(phoneNumber: $phoneNumber, code: $code) {
      success
      message
    }
  }
`;

export const SET_ACCOUNT = gql`
  mutation setUserAccount($name: String!, $email: String!, $phone: String!) {
    createCustomer(data: { name: $name, email: $email, phone: $phone }) {
      data {
        attributes {
          name
        }
      }
    }
  }
`;

export const LOG_IN = gql`
  mutation logIn($email: String!) {
    login(input: { identifier: $email, password: "password" }) {
      jwt
    }
  }
`;

export const REGISTER = gql`
  mutation register(
    $username: String!
    $email: String!
    $phone: String!
    $games: ID!
  ) {
    register(
      input: {
        username: $username
        email: $email
        password: "password"
        phone: $phone
        games: $games
      }
    ) {
      jwt
      user {
        username
        email
      }
    }
  }
`;

export const GAMES = gql`
  query {
    games {
      id
      title
      image {
        id
        url
      }
    }
  }
`;
