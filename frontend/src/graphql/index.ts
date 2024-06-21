import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

import { API_URL } from "../config";

const mock_uri = process.env.NEXT_PUBLIC_MOCK_GRAPHQL_URL;
// Default headers for Guess//
// const headers = null;

const uploadLink = createUploadLink({
  uri: `${API_URL}/graphql`,
});

const client = new ApolloClient({
  // credentials: 'include',
  // uri: `${API_URL}/graphql`,
  link: uploadLink,
  cache: new InMemoryCache(),
});

export default client;

export const mockupClient = new ApolloClient({
  uri: mock_uri,
  cache: new InMemoryCache(),
});
