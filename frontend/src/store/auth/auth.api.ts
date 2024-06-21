import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "@/graphql";
import {
  SIGN_IN_MUTATION,
  UPDATE_USER_MUTATION,
  SWITCH_FAVORITE_LISTING_MUTATION,
  GET_STRIPE_PAYMENT_METHODS_QUERY,
  DEPOSIT_TO_BALANCE_MUTATION,
  GET_SUBSCRIPTION_PRICES_QUERY,
  CREATE_CHARSI_PREMIUM_SUBSCRIPTION_MUTATION,
  CANCEL_CHARSI_PREMIUM_SUBSCRIPTION_MUTATION,
  UPDATE_MY_NOTIFICATION_SETTINGS_MUTATION,
  GET_CHARSI_BALANCE_MUTATION,
} from "./auth.graphql";

interface SignInPayLoad {
  email: string;
}

interface UpdateMyNotificationSettingError extends Error {
  originalPayload: object;
}

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (payload: SignInPayLoad) => {
    try {
      const { data } = await client.mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { email: payload.email },
      });

      return data.login;
    } catch (error) {
      throw new Error(`Failed to sign in: ${error.message}`);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (payload: any) => {
    try {
      const { onSuccess, ...rest } = payload;
      const { data } = await client.mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: { input: rest },
      });

      onSuccess();

      return data.updateUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
);

export const switchMyFavoriteListing = createAsyncThunk(
  "auth/switchMyFavoriteListing",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: SWITCH_FAVORITE_LISTING_MUTATION,
        variables: { me: payload.me, listings: payload.listings },
      });

      return data.updateUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
);

export const getStripePaymentMethods = createAsyncThunk(
  "auth/getStripePaymentMethods",
  async () => {
    try {
      const { data } = await client.query({
        query: GET_STRIPE_PAYMENT_METHODS_QUERY,
        fetchPolicy: "network-only",
      });

      return data.getPaymentMethods;
    } catch (error) {
      throw new Error(`Failed to get stripe payment methods: ${error.message}`);
    }
  }
);

export const depositToBalance = createAsyncThunk(
  "auth/depositToBalance",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: DEPOSIT_TO_BALANCE_MUTATION,
        variables: { ...payload },
      });

      payload.onSuccess && payload.onSuccess();

      return data.depositToCharsiBalance;
    } catch (error) {
      payload.onFail && payload.onFail(error);
      throw new Error(`Failed to deposit to balance: ${error.message}`);
    }
  }
);

export const getSubscriptionPrices = createAsyncThunk(
  "auth/getSubscriptionPrices",
  async () => {
    try {
      const { data } = await client.query({
        query: GET_SUBSCRIPTION_PRICES_QUERY,
      });

      return data.getSubscriptionPrices;
    } catch (error) {
      throw new Error(`Failed to get subscription prices: ${error.message}`);
    }
  }
);

export const createCharsiPremiumSubscription = createAsyncThunk(
  "auth/createCharsiPremiumSubscription",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_CHARSI_PREMIUM_SUBSCRIPTION_MUTATION,
        variables: { ...payload },
      });

      payload.onSuccess && payload.onSuccess();

      return data.createPremiumSubscription;
    } catch (error) {
      payload.onFail && payload.onFail(error);
      throw new Error(
        `Failed to create Charsi premium subscription: ${error.message}`
      );
    }
  }
);

export const cancelCharsiPremiumSubscription = createAsyncThunk(
  "auth/cancelCharsiPremiumSubscription",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: CANCEL_CHARSI_PREMIUM_SUBSCRIPTION_MUTATION,
      });

      payload.onSuccess && payload.onSuccess();

      return data.cancelCharsiPremiumSubscription;
    } catch (error) {
      payload.onFail && payload.onFail(error);
      throw new Error(
        `Failed to cancel Charsi premium subscription: ${error.message}`
      );
    }
  }
);

export const updateMyNotificationSettings = createAsyncThunk(
  "auth/updateMyNotificationSettings",
  async (payload: any) => {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_MY_NOTIFICATION_SETTINGS_MUTATION,
        variables: { ...payload },
      });

      payload.onSuccess && payload.onSuccess();

      return data.updateMyNotificationSettings;
    } catch (error) {
      payload.onFail && payload.onFail(error);
      const customError: UpdateMyNotificationSettingError = new Error(
        `Failed to update my notification settings: ${error.message}`
      ) as UpdateMyNotificationSettingError;
      customError.originalPayload = payload;
      throw customError;
    }
  }
);

export const getCharsiBalance = createAsyncThunk(
  "auth/getCharsiBalance",
  async () => {
    try {
      const { data } = await client.mutate({
        mutation: GET_CHARSI_BALANCE_MUTATION,
      });

      return data.getCharsiBalance;
    } catch (error) {
      throw new Error(`Failed to get Charsi balance: ${error.message}`);
    }
  }
);
