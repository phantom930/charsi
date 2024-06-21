import { gql } from "@apollo/client";

const AUTH_PAYLOAD = `
  id
  firstname
  lastname
  username
  email
  phone
  discordAccessToken
  balance
  stripeCustomerID
  premium
  premiumSubscriptionID
  avatar {
    id
    name
    url
    previewUrl
  }
  gameAccounts
  games {
    id
  }
  favoriteListings {
    id
  }
  description
  trades
  notificationSettings
  created_at
  updated_at
`;

export const GET_PHONE_CODE_MUTATION = gql`
  mutation getPhoneCode($phoneNumber: String!, $channel: String!) {
    getPhoneCode(phoneNumber: $phoneNumber, channel: $channel) {
      success
      message
    }
  }
`;

export const VERIFY_PHONE_CODE_MUTATION = gql`
  mutation verifyPhoneCode($phoneNumber: String!, $code: String!) {
    verifyPhoneCode(phoneNumber: $phoneNumber, code: $code) {
      success
      message
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation logIn($email: String!, $discordAccessToken: String) {
    login(input: { identifier: $email, password: "password", discordAccessToken: $discordAccessToken }) {
      jwt
      user {
        ${AUTH_PAYLOAD}
      }
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation register($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      jwt
      user {
        ${AUTH_PAYLOAD}
      }
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($input: updateUserInput) {
    updateUser(input: $input) {
      user {
        ${AUTH_PAYLOAD}
      }
    }
  }
`;

export const CREATE_AVATAR_MUTATION = gql`
  mutation createAvatar($input: createAvatarInput) {
    createAvatar(input: $input) {
      avatar {
        id
        name
        picture {
          name
          caption
        }
      }
    }
  }
`;

export const SWITCH_FAVORITE_LISTING_MUTATION = gql`
  mutation switchFavoriteListing($me: ID!, $listings: [ID]) {
    updateUser(
      input: { where: { id: $me }, data: { favoriteListings: $listings } }
    ) {
      user {
        favoriteListings {
          id
        }
      }
    }
  }
`;

export const GET_STRIPE_PAYMENT_METHODS_QUERY = gql`
  query getStripePaymentMethods {
    getPaymentMethods
  }
`;

export const ATTACH_STRIPE_PAYMENT_METHOD_MUTATION = gql`
  mutation attachStripePaymentMethod($input: String) {
    attachPaymentMethod(paymentID: $input)
  }
`;

export const DEPOSIT_TO_BALANCE_MUTATION = gql`
  mutation depositToBalance($amount: Float, $paymentMethodID: String) {
    depositToCharsiBalance(amount: $amount, paymentID: $paymentMethodID)
  }
`;

export const GET_SUBSCRIPTION_PRICES_QUERY = gql`
  query {
    getSubscriptionPrices
  }
`;

export const GET_MY_SUBSCRIPTION_QUERY = gql`
  query {
    getCustomerSubscription
  }
`;

export const CREATE_CHARSI_PREMIUM_SUBSCRIPTION_MUTATION = gql`
  mutation createCharsiPremiumSubscription(
    $priceID: String
    $paymentID: String
  ) {
    createPremiumSubscription(priceID: $priceID, paymentID: $paymentID)
  }
`;

export const CANCEL_CHARSI_PREMIUM_SUBSCRIPTION_MUTATION = gql`
  mutation {
    cancelPremiumSubscription
  }
`;

export const UPDATE_MY_NOTIFICATION_SETTINGS_MUTATION = gql`
  mutation updateMyNotificationSettings(
    $setting: String
    $method: String
    $checked: Boolean!
  ) {
    updateMyNotificationSettings(
      setting: $setting
      method: $method
      checked: $checked
    )
  }
`;

export const UPDATE_FCM_REGISTRATION_TOKEN_MUTATION = gql`
  mutation updateMyFCMRegistrationToken($token: String!) {
    updateMyFCMRegistrationToken(token: $token)
  }
`;

export const GET_CHARSI_BALANCE_MUTATION = gql`
  mutation getCharsiBalanceMutation {
    getCharsiBalance
  }
`;
