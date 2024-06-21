import { gql } from "@apollo/client";

export const GAME_PAYLOAD = `
  id
  title
  image {
    id
    url
  }
  cover {
    id
    name
    url
  }
  logo {
    id
    name
    url
  }
`;

export const GET_GAMES_QUERY = gql`
  query {
    games {
      ${GAME_PAYLOAD}
    }
  }
`;
