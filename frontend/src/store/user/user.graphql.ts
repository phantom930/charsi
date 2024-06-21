import { gql } from "@apollo/client";

import { GAME_PAYLOAD } from "@store/game/game.graphql";

export const SIMPLE_USER_PAYLOAD = `
  id
  username
  avatar {
    id
    name
    url
  }
  reviewRate
  created_at
  updated_at
`;

export const USER_PAYLOAD = `
  id
  username
  balance
  avatar {
    id
    name
    url
  }
  gameAccounts
  games {
    ${GAME_PAYLOAD}
  }
  description
  trades
  premium
  reviewRate
  created_at
  updated_at
`;

export const CHATROOM_PAYLOAD = `
  id
  sender {
    ${USER_PAYLOAD}
  }
  recipient {
    ${USER_PAYLOAD}
  }
  type
`;

export const NOTIFICATIONS_PAYLOAD = `
  id
  sender {
    ${USER_PAYLOAD}
  }
  type
  data
  read
  created_at
  updated_at
`;

export const GET_USER_ONE = gql`
  query GetFindOneUser($input: ID) {
    users(where: { id: $input }) {
      ${USER_PAYLOAD}
    }
  }
`;

export const SEARCH_USERS_BY_PATTERN_QUERY = gql`
  query SearchUsersByPattern($input: String) {
    users(where: { _or: [{ username_contains: $input }] }) {
      ${USER_PAYLOAD}
    }
  }
`;

export const GET_USER_BY_USERNAME_QUERY = gql`
  query GetUserByUsername($username: String) {
    users(where: { username: $username }) {
      ${USER_PAYLOAD}
    }
  }
`;

export const GET_CHAT_USERS_QUERY = gql`
  query GetChatUsers($input: [ID]) {
    users(where: { id_in: $input }) {
      ${USER_PAYLOAD}
    }
  }
`;

export const COUNT_UNREAD_NOTIFICATIONS_QUERY = gql`
  query CountUnreadNotifications($recipient: ID) {
    notificationsConnection(where: { read: false, recipient: $recipient }) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_NOTIFICATIONS_QUERY = gql`
  query GetNotifications($recipient: ID) {
    notifications(where: { recipient: $recipient }, sort: "created_at:desc") {
      ${NOTIFICATIONS_PAYLOAD}
    }
  }
`;

export const SEND_CHAT_NOTIFICATION_MUTATION = gql`
  mutation SendChatNotification($recipientID: ID!, $chatRoomID: String) {
    sendChatNotification(recipientID: $recipientID, chatRoomID: $chatRoomID)
  }
`;

export const GET_NOTIFICATION_BY_ID_QUERY = gql`
  query GetNotificationByID($id: ID) {
    notifications(where: { id: $id }) {
      ${NOTIFICATIONS_PAYLOAD}
    }
  }
`;

export const GET_4_LATEST_USERS_QUERY = gql`
  query Get4LatestUsers($pattern: String) {
    users(limit: 4, sort: "created_at:desc", where: { username_contains: $pattern }) {
      ${SIMPLE_USER_PAYLOAD}
    }
  }
`;
