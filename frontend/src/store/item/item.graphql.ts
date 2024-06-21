import { gql } from "@apollo/client";

import { UPLOAD_FILE_PAYLOAD } from "@store/listing/listing.graphql";

export const ITEM_PROPERTY_PAYLOAD = `
  id
  name
  suzerainMajorCategories {
    id
    name
  }
  propertyType
`;

export const ITEM_PAYLOAD = `
  id
  name
  image {
    ${UPLOAD_FILE_PAYLOAD}
  }
  properties(sort: "name:asc") {
    ${ITEM_PROPERTY_PAYLOAD}
  }
`;

export const GET_ITEMS_QUERY = gql`
  query ($game: ID, $majorCategory: ID) {
    items(
      sort: "name:asc"
      where: { game: $game, majorCategory: $majorCategory }
    ) {
      ${ITEM_PAYLOAD}
    }
  }
`;

export const GET_ITEM_MAJOR_CATEGORIES_QUERY = gql`
  query {
    itemMajorCategories(sort: "displayOrder:asc") {
      id
      name
      isItemType
    }
  }
`;

export const GET_ITEM_MAJOR_CATEGORIES_BY_GAME_QUERY = gql`
  query ($game: ID) {
    itemMajorCategories(
      sort: "displayOrder:asc"
      where: { suzerainGames_in: [$game] }
    ) {
      id
      name
      isItemType
    }
  }
`;

export const GET_ITEM_MINOR_CATEGORIES_QUERY = gql`
  query ($game: ID) {
    itemMinorCategories(
      sort: "name:asc"
      where: { suzerainGames_in: [$game] }
    ) {
      id
      name
      suzerainMajorCategories {
        id
        name
      }
    }
  }
`;

export const GET_ITEM_SUB_CATEGORIES_QUERY = gql`
  query ($game: ID) {
    itemSubCategoriesConnection(where: { suzerainGames_in: [$game] }) {
      groupBy {
        minorCategory {
          key
          connection {
            values {
              id
              name
              suzerainMajorCategories {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ITEM_PROPERTIES_QUERY = gql`
  query ($game: ID) {
    itemProperties(sort: "name:asc", where: { games_in: [$game] }) {
      id
      name
      suzerainMajorCategories {
        id
        name
      }
      propertyType
    }
  }
`;
