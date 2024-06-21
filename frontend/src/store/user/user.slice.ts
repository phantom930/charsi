import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import _ from "lodash";

import {
  getUserByUsername,
  getChatUsers,
  countUnreadNotifications,
  getNotifications,
  pushNewNotification,
} from "./user.api";
import type { GameAccountsType } from "@store/auth/auth.slice";
import type { GameQueryData } from "@store/game/game.slice";
import type { UploadFile } from "@store/listing/listing.slice";

export interface UserQueryData {
  id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  provider?: string;
  phone?: string;
  avatar?: UploadFile;
  balance?: number;
  gameAccounts?: GameAccountsType;
  games?: GameQueryData[];
  description?: string;
  trades?: number;
  premium?: boolean;
  reviewRate?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface MessageQueryData {
  text: string;
  read: boolean;
  isMine: boolean;
  isNotification: boolean;
  notificationData: object;
  created_at: string;
}

export interface ChatRoomQueryData {
  id: string;
  type: "DM" | "TRADE";
  sender?: UserQueryData;
  recipient?: UserQueryData;
  isTemporary?: boolean;
  unreadMessages: number;
  created_at: string;
  updated_at: string;
}

export interface ChatQueryData {
  roomID: string;
  messages: MessageQueryData[];
}

export interface ChatMessagesAggregate {
  [roomID: string]: {
    count: number;
    messages: MessageQueryData[];
  };
}

export interface NotificationQueryData {
  id: string;
  sender: UserQueryData;
  recipient?: UserQueryData;
  type:
    | "ChatMessages"
    | "PurchasedMyListing"
    | "BidOnMyListing"
    | "MyOfferAccepted"
    | "MyOfferDeclined"
    | "MyRequestResponse";
  data: Object;
  read: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface InitialUserState {
  users: UserQueryData[] | [];
  chatRooms: ChatRoomQueryData[] | [];
  chats: ChatQueryData[] | [];
  notificationsCount: number;
  notifications: NotificationQueryData[] | [];
  isNotificationsLoaded: boolean;
  isChatRoomsLoaded: boolean;
}

const initialState: InitialUserState = {
  users: [],
  chatRooms: [],
  chats: [],
  notificationsCount: 0,
  notifications: [],
  isNotificationsLoaded: false,
  isChatRoomsLoaded: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, { payload }: PayloadAction<UserQueryData>) => {
      state.users = [...state.users, { ...payload }];
    },
    loadChatRooms: (state, { payload }: PayloadAction<ChatRoomQueryData[]>) => {
      state.chatRooms = [...payload];
      state.isChatRoomsLoaded = true;
    },
    createTemporaryChatRoom: (
      state,
      {
        payload,
      }: PayloadAction<{
        senderID: string;
        recipientID: string;
        type: "DM" | "TRADE";
        callback?: Function;
      }>
    ) => {
      let tempChatRoom: ChatRoomQueryData;
      const previousRoom: ChatRoomQueryData = state.chatRooms.find(
        (chatRoom: ChatRoomQueryData) => {
          return (
            (chatRoom.sender.id === payload.senderID &&
              chatRoom.recipient.id === payload.recipientID) ||
            (chatRoom.sender.id === payload.recipientID &&
              chatRoom.recipient.id === payload.senderID)
          );
        }
      );
      if (previousRoom) {
        tempChatRoom = previousRoom;
      } else {
        tempChatRoom = {
          id: nanoid(20),
          sender: {
            id: payload.senderID,
          },
          recipient: {
            id: payload.recipientID,
          },
          type: "DM",
          isTemporary: true,
          unreadMessages: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        state.chatRooms = [tempChatRoom, ...state.chatRooms];
      }
      if (payload.callback) {
        payload.callback(tempChatRoom.id);
      }
    },
    switchTemporaryChatRoom: (
      state,
      { payload: roomID }: PayloadAction<string>
    ) => {
      const chatRoomIndex: number = state.chatRooms.findIndex(
        (chatRoom: ChatRoomQueryData) => chatRoom.id === roomID
      );
      if (chatRoomIndex > -1) {
        let updatedChatRooms = _.cloneDeep(state.chatRooms);
        updatedChatRooms[chatRoomIndex].isTemporary = false;
        state.chatRooms = [...updatedChatRooms];
      }
    },
    loadChatMessages: (
      state,
      {
        payload,
      }: PayloadAction<{ roomID: string; messages: MessageQueryData[] }>
    ) => {
      const { roomID, messages } = payload;
      const chats: ChatQueryData[] = _.cloneDeep(state.chats);
      const chatIndex: number = chats.findIndex(
        (chat: ChatQueryData) => chat.roomID === roomID
      );
      if (chatIndex > -1) {
        chats[chatIndex].messages = [...messages];
      } else {
        chats.push({ roomID, messages });
      }

      state.chats = [...chats];
    },
    pushChatMessages: (
      state,
      { payload }: PayloadAction<ChatMessagesAggregate>
    ) => {
      Object.keys(payload).forEach((roomID: string) => {
        const { count, messages } = payload[roomID];
        let chatRooms: ChatRoomQueryData[] = _.cloneDeep(state.chatRooms);
        const chatRoomIndex: number = chatRooms.findIndex(
          (chatRoom: ChatRoomQueryData) => chatRoom.id === roomID
        );
        if (chatRoomIndex > -1) {
          chatRooms[chatRoomIndex].unreadMessages = count;
        }
        let chats: ChatQueryData[] = _.cloneDeep(state.chats);
        const chatIndex: number = chats.findIndex(
          (chat: ChatQueryData) => chat.roomID === roomID
        );
        if (chatIndex > -1) {
          chats[chatIndex].messages = [
            ...chats[chatIndex].messages,
            ...messages,
          ];
        }
        state.chatRooms = [...chatRooms];
        state.chats = [...chats];
      });
    },
    pushSendingChatMessage: (
      state,
      { payload }: PayloadAction<{ roomID: string; message: MessageQueryData }>
    ) => {
      const { roomID, message } = payload;
      let chats: ChatQueryData[] = [...state.chats];
      const chatIndex: number = chats.findIndex(
        (chat: ChatQueryData) => chat.roomID === roomID
      );
      if (chatIndex > -1) {
        chats[chatIndex].messages = [...chats[chatIndex].messages, message];
      } else {
        chats.push({ roomID, messages: [message] });
      }
      state.chats = [...chats];
    },
    markUnreadMessagesAsRead: (
      state,
      { payload: roomID }: PayloadAction<string>
    ) => {
      const chatIndex: number = state.chats.findIndex(
        (chat: ChatQueryData) => chat.roomID === roomID
      );
      if (chatIndex > -1) {
        let updatedChats = state.chats;
        _.set(
          updatedChats,
          `[${chatIndex}].messages`,
          updatedChats[chatIndex].messages.map((message: MessageQueryData) => {
            return {
              ...message,
              read: true,
            };
          })
        );
        state.chats = [...updatedChats];
      }

      const chatRoomIndex: number = state.chatRooms.findIndex(
        (chatRoom: ChatRoomQueryData) => chatRoom.id === roomID
      );
      if (chatRoomIndex > -1) {
        let updatedChatRooms = state.chatRooms;
        _.set(updatedChatRooms, `[${chatRoomIndex}].unreadMessages`, 0);
        state.chatRooms = [...updatedChatRooms];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getUserByUsername.fulfilled,
        (state, { payload }: PayloadAction<UserQueryData>) => {
          state.users = [...state.users, { ...payload }];
        }
      )
      .addCase(
        getChatUsers.fulfilled,
        (state, { payload }: PayloadAction<UserQueryData[]>) => {
          state.users = [...state.users, ...payload];
        }
      )
      .addCase(
        countUnreadNotifications.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          state.notificationsCount = payload;
        }
      )
      .addCase(
        getNotifications.fulfilled,
        (state, { payload }: PayloadAction<NotificationQueryData[]>) => {
          state.notifications = [...payload];
          state.isNotificationsLoaded = true;
        }
      )
      .addCase(getNotifications.rejected, (state) => {
        state.isNotificationsLoaded = true;
      })
      .addCase(
        pushNewNotification.fulfilled,
        (state, { payload }: PayloadAction<NotificationQueryData>) => {
          state.notifications = [payload, ..._.cloneDeep(state.notifications)];
          state.notificationsCount++;
        }
      );
  },
});

export const {
  addUser,
  loadChatRooms,
  createTemporaryChatRoom,
  switchTemporaryChatRoom,
  loadChatMessages,
  pushChatMessages,
  pushSendingChatMessage,
  markUnreadMessagesAsRead,
} = userSlice.actions;

export default userSlice.reducer;
