import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import setAuthToken from "@helpers/setAuthToken";
import { authenticateApolloClient } from "@/helpers";
import logOut from "@helpers/logout";
import {
  updateUser,
  switchMyFavoriteListing,
  getStripePaymentMethods,
  depositToBalance,
  getSubscriptionPrices,
  createCharsiPremiumSubscription,
  cancelCharsiPremiumSubscription,
  updateMyNotificationSettings,
  getCharsiBalance,
} from "./auth.api";

interface UserGameData {
  id: string;
}

interface AvatarProps {
  id: string;
  name: string;
  previewUrl: string;
  url: string;
}

export interface GameAccountsType {
  battleNet?: string;
  nintendo?: string;
  playStation?: string;
  xbox?: string;
}

export interface NotificationSetting {
  ChatMessages: {
    browser: true;
    text: false;
    email: false;
  };
  PurchasedMyListing: {
    browser: true;
    text: false;
    email: false;
  };
  BidOnMyListing: {
    browser: true;
    text: false;
    email: false;
  };
  MyOfferAccepted: {
    browser: true;
    text: false;
    email: false;
  };
  MyOfferDeclined: {
    browser: true;
    text: false;
    email: false;
  };
  MyRequestResponse: {
    browser: true;
    text: false;
    email: false;
  };
}

export interface SetAuthPayload {
  id?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  username: string;
  avatar: AvatarProps;
  phone: string;
  discordAccessToken: string;
  balance: number;
  stripeCustomerID: string;
  premium: boolean;
  premiumSubscriptionID: string;
  gameAccounts: GameAccountsType;
  games: [UserGameData] | [];
  favoriteListings: { id: string }[] | [];
  description: string;
  trades: number;
  notificationSettings: NotificationSetting;
  created_at: Date;
  updated_at: Date;
  jwt: string;
}

export interface SetDiscordAuthPayload {
  email: string;
  username: string;
  avatar: AvatarProps;
}

export interface InitialAuthState {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  avatar: AvatarProps;
  phone: string;
  discordAccessToken: string;
  balance: number;
  stripeCustomerID: string;
  stripePaymentMethods: object[] | [];
  subscriptionPrices: object[] | [];
  premium: boolean;
  premiumSubscriptionID: string;
  gameAccounts: GameAccountsType;
  games: string[] | [];
  favoriteListings: string[] | [];
  description: string;
  trades: number;
  notificationSettings: NotificationSetting;
  created_at: Date | null;
  updated_at: Date | null;
  isAuthenticated: boolean;
}

const defaultNotificationSettings: NotificationSetting = {
  ChatMessages: {
    browser: true,
    text: false,
    email: false,
  },
  PurchasedMyListing: {
    browser: true,
    text: false,
    email: false,
  },
  BidOnMyListing: {
    browser: true,
    text: false,
    email: false,
  },
  MyOfferAccepted: {
    browser: true,
    text: false,
    email: false,
  },
  MyOfferDeclined: {
    browser: true,
    text: false,
    email: false,
  },
  MyRequestResponse: {
    browser: true,
    text: false,
    email: false,
  },
};

const initialState: InitialAuthState = {
  id: "",
  email: "",
  firstname: "",
  lastname: "",
  username: "",
  avatar: { id: "", name: "", previewUrl: "", url: "" },
  phone: "",
  discordAccessToken: "",
  balance: 0,
  stripeCustomerID: "",
  stripePaymentMethods: [],
  subscriptionPrices: [],
  premium: false,
  premiumSubscriptionID: "",
  gameAccounts: { battleNet: "", nintendo: "", playStation: "", xbox: "" },
  games: [],
  favoriteListings: [],
  description: "",
  trades: 0,
  notificationSettings: defaultNotificationSettings,
  created_at: null,
  updated_at: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, { payload }: PayloadAction<SetAuthPayload>) => {
      setAuthToken(payload.jwt);
      authenticateApolloClient(payload.jwt);
      state.id = payload?.id || "";
      state.email = payload.email || "";
      state.firstname = payload?.firstname || "";
      state.lastname = payload?.lastname || "";
      state.username = payload.username || "";
      state.avatar = payload.avatar || {
        id: "",
        name: "",
        previewUrl: "",
        url: "",
      };
      state.phone = payload.phone || "";
      state.discordAccessToken = payload.discordAccessToken || "";
      state.balance = payload.balance || 0;
      state.stripeCustomerID = payload.stripeCustomerID || "";
      state.premium = payload.premium || false;
      state.premiumSubscriptionID = payload.premiumSubscriptionID || "";
      state.gameAccounts = payload.gameAccounts || {
        battleNet: "",
        nintendo: "",
        playStation: "",
        xbox: "",
      };
      state.games = payload.games.map((game: UserGameData) => game.id) || [];
      state.favoriteListings =
        payload.favoriteListings.map((listing) => listing.id) || [];
      state.description = payload.description || "";
      state.trades = payload.trades || 0;
      state.notificationSettings =
        payload.notificationSettings || defaultNotificationSettings;
      state.created_at = payload.created_at || null;
      state.updated_at = payload.updated_at || null;
      state.isAuthenticated = true;
    },
    setDiscordAuth: (
      state,
      { payload }: PayloadAction<SetDiscordAuthPayload>
    ) => {
      state.email = payload.email || "";
      state.username = payload.username || "";
      state.avatar = payload.avatar || {
        id: "",
        name: "",
        previewUrl: "",
        url: "",
      };
    },
    clearAuth: (state) => {
      logOut();
      state.id = "";
      state.email = "";
      state.firstname = "";
      state.lastname = "";
      state.username = "";
      state.avatar = { id: "", name: "", previewUrl: "", url: "" };
      state.phone = "";
      state.discordAccessToken = "";
      state.balance = 0;
      state.stripeCustomerID = "";
      state.stripePaymentMethods = [];
      state.subscriptionPrices = [];
      state.premium = false;
      state.premiumSubscriptionID = "";
      state.gameAccounts = {
        battleNet: "",
        nintendo: "",
        playStation: "",
        xbox: "",
      };
      state.games = [];
      state.favoriteListings = [];
      state.description = "";
      state.trades = 0;
      state.notificationSettings = defaultNotificationSettings;
      state.created_at = null;
      state.updated_at = null;
      state.isAuthenticated = false;
    },
    updateNotificationSetting: (
      state,
      {
        payload,
      }: PayloadAction<{
        setting: string;
        method: "browser" | "text" | "email";
        checked: boolean;
      }>
    ) => {
      const { setting, method, checked } = payload;
      state.notificationSettings[setting][method] = checked;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        updateUser.fulfilled,
        (state, { payload }: PayloadAction<any>) => {
          state.email = (payload as any).user.email || "";
          state.firstname = (payload as any).user.firstname || "";
          state.lastname = (payload as any).user.lastname || "";
          state.username = (payload as any).user.username || "";
          state.avatar = (payload as any).user.avatar || {
            id: "",
            name: "",
            previewUrl: "",
            url: "",
          };
          state.phone = (payload as any).user.phone || "";
          state.discordAccessToken =
            (payload as any).user.discordAccessToken || "";
          state.balance = (payload as any).user.balance || 0;
          state.stripeCustomerID = (payload as any).stripeCustomerID || "";
          state.premium = (payload as any).premium || false;
          state.premiumSubscriptionID =
            (payload as any).premiumSubscriptionID || "";
          state.gameAccounts = (payload as any).user.gameAccounts || {
            battleNet: "",
            nintendo: "",
            playStation: "",
            xbox: "",
          };
          state.games =
            (payload as any).user.games.map((game: UserGameData) => game.id) ||
            [];
          state.favoriteListings =
            (payload as any).user.favoriteListings.map(
              (listing) => listing.id
            ) || [];
          state.description = (payload as any).user.description || "";
          state.trades = (payload as any).user.trades || 0;
          state.notificationSettings =
            (payload as any).user.notificationSettings ||
            defaultNotificationSettings;
          state.created_at = (payload as any).user.created_at || null;
          state.updated_at = (payload as any).user.updated_at || null;
        }
      )
      .addCase(
        switchMyFavoriteListing.fulfilled,
        (state, { payload }: PayloadAction<any>) => {
          state.favoriteListings =
            (payload as any).user.favoriteListings.map(
              (listing) => listing.id
            ) || [];
        }
      )
      .addCase(
        getStripePaymentMethods.fulfilled,
        (state, { payload }: PayloadAction<object[]>) => {
          state.stripePaymentMethods = payload || [];
        }
      )
      .addCase(
        depositToBalance.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          state.balance = payload;
        }
      )
      .addCase(
        getSubscriptionPrices.fulfilled,
        (state, { payload }: PayloadAction<object[]>) => {
          state.subscriptionPrices = payload || [];
        }
      )
      .addCase(
        createCharsiPremiumSubscription.fulfilled,
        (state, { payload }: PayloadAction<object>) => {
          state.premium = true;
          state.premiumSubscriptionID = (payload as any).premiumSubscriptionID;
        }
      )
      .addCase(cancelCharsiPremiumSubscription.fulfilled, (state) => {
        state.premium = false;
        state.premiumSubscriptionID = "";
      })
      .addCase(
        updateMyNotificationSettings.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          const { setting, method } = (action as any).meta.arg;
          state.notificationSettings[setting][method] = action.payload;
        }
      )
      .addCase(updateMyNotificationSettings.rejected, (state, { meta }) => {
        const { setting, method, checked } = meta.arg;
        state.notificationSettings[setting][method] = !checked;
      })
      .addCase(
        getCharsiBalance.fulfilled,
        (state, { payload }: PayloadAction<number>) => {
          state.balance = payload;
        }
      );
  },
});

export const { setAuth, setDiscordAuth, clearAuth, updateNotificationSetting } =
  authSlice.actions;
export default authSlice.reducer;
