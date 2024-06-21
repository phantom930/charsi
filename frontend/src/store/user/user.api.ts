import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "@/graphql";
import {
  GET_USER_BY_USERNAME_QUERY,
  GET_CHAT_USERS_QUERY,
  COUNT_UNREAD_NOTIFICATIONS_QUERY,
  GET_NOTIFICATIONS_QUERY,
  GET_NOTIFICATION_BY_ID_QUERY,
} from "./user.graphql";

export interface GetUserByUsernamePayload {
  username: string;
  onSuccess?: () => void;
}

export const getUserByUsername = createAsyncThunk(
  "user/getUserByUsername",
  async ({ username, onSuccess }: GetUserByUsernamePayload) => {
    try {
      const { data } = await client.query({
        query: GET_USER_BY_USERNAME_QUERY,
        variables: { username },
      });

      onSuccess && onSuccess();
      return data.users[0];
    } catch (error) {
      throw new Error(`Failed to get user data: ${error.message}`);
    }
  }
);

export interface GetChatUsersPayload {
  input: string[];
  onSuccess?: Function;
}

export const getChatUsers = createAsyncThunk(
  "user/getChatUsers",
  async ({ input, onSuccess }: GetChatUsersPayload) => {
    try {
      const { data } = await client.query({
        query: GET_CHAT_USERS_QUERY,
        variables: { input },
      });

      onSuccess && onSuccess();

      return data.users;
    } catch (error) {
      throw new Error(`Failed to get users data: ${error.message}`);
    }
  }
);

export const countUnreadNotifications = createAsyncThunk(
  "users/countUnreadNotifications",
  async ({ recipient }: { recipient: string }) => {
    try {
      const { data } = await client.query({
        query: COUNT_UNREAD_NOTIFICATIONS_QUERY,
        variables: { recipient },
      });

      return data.notificationsConnection.aggregate.count;
    } catch (error) {
      throw new Error(
        `Failed to get unread notifications count: ${error.message}`
      );
    }
  }
);

export const getNotifications = createAsyncThunk(
  "users/getNotifications",
  async ({ recipient }: { recipient: string }) => {
    try {
      const { data } = await client.query({
        query: GET_NOTIFICATIONS_QUERY,
        variables: { recipient },
      });

      return data.notifications;
    } catch (error) {
      throw new Error(`Failed to get notifications: ${error.message}`);
    }
  }
);

export const pushNewNotification = createAsyncThunk(
  "users/pushNewNotification",
  async ({ notificationID }: { notificationID: string }) => {
    try {
      const { data } = await client.query({
        query: GET_NOTIFICATION_BY_ID_QUERY,
        variables: { id: notificationID },
      });

      return data.notifications[0];
    } catch (error) {
      throw new Error(`Failed to get notification: ${error.message}`);
    }
  }
);
