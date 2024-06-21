import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "@/graphql";
import {
  GET_ITEMS_QUERY,
  GET_ITEM_MAJOR_CATEGORIES_QUERY,
  GET_ITEM_MAJOR_CATEGORIES_BY_GAME_QUERY,
  GET_ITEM_MINOR_CATEGORIES_QUERY,
  GET_ITEM_SUB_CATEGORIES_QUERY,
  GET_ITEM_PROPERTIES_QUERY,
} from "./item.graphql";

interface GetItemCategoriesByGamePayload {
  game: string;
}

export interface GetItemsPayload extends GetItemCategoriesByGamePayload {
  majorCategory?: string;
}
export interface GetItemMajorCategoriesByGamePayload
  extends GetItemCategoriesByGamePayload {}
export interface GetItemMinorCategoriesPayload
  extends GetItemCategoriesByGamePayload {}
export interface GetItemSubCategoriesPayload
  extends GetItemCategoriesByGamePayload {}
export interface GetItemPropertiesPayload
  extends GetItemCategoriesByGamePayload {}

export const getItems = createAsyncThunk(
  "item/getItems",
  async (payload: GetItemsPayload) => {
    try {
      const { data } = await client.query({
        query: GET_ITEMS_QUERY,
        variables: {
          game: payload.game,
          majorCategory: payload.majorCategory,
        },
      });

      return {
        game: payload.game,
        itemMajorCategory: payload.majorCategory,
        items: data.items,
      };
    } catch (error) {
      throw new Error(`Failed to get items data: ${error.message}`);
    }
  }
);

export const getItemMajorCategories = createAsyncThunk(
  "item/getItemMajorCategories",
  async () => {
    try {
      const { data } = await client.query({
        query: GET_ITEM_MAJOR_CATEGORIES_QUERY,
      });

      return data.itemMajorCategories;
    } catch (error) {
      throw new Error(
        `Failed to get item major categories data: ${error.message}`
      );
    }
  }
);

export const getItemMajorCategoriesByGame = createAsyncThunk(
  "item/getItemMajorCategoriesByGame",
  async (payload: GetItemMajorCategoriesByGamePayload) => {
    try {
      const { data } = await client.query({
        query: GET_ITEM_MAJOR_CATEGORIES_BY_GAME_QUERY,
        variables: {
          game: payload.game,
        },
      });

      return { game: payload.game, categories: data.itemMajorCategories };
    } catch (error) {
      throw new Error(
        `Failed to get item major categories data: ${error.message}`
      );
    }
  }
);

export const getItemMinorCategories = createAsyncThunk(
  "item/getItemMinorCategories",
  async (payload: GetItemMinorCategoriesPayload) => {
    try {
      const { data } = await client.query({
        query: GET_ITEM_MINOR_CATEGORIES_QUERY,
        variables: {
          game: payload.game,
        },
      });

      return { game: payload.game, categories: data.itemMinorCategories };
    } catch (error) {
      throw new Error(
        `Failed to get item minor categories data: ${error.message}`
      );
    }
  }
);

export const getItemSubCategories = createAsyncThunk(
  "item/getItemSubCategories",
  async (payload: GetItemSubCategoriesPayload) => {
    try {
      const { data } = await client.query({
        query: GET_ITEM_SUB_CATEGORIES_QUERY,
        variables: {
          game: payload.game,
        },
      });

      const categories = {};
      data.itemSubCategoriesConnection.groupBy.minorCategory.forEach(
        (category) => {
          const values = [...category.connection.values];
          values.sort((subCategory1, subCategory2) =>
            subCategory1.name.localeCompare(subCategory2.name)
          );
          categories[category.key] = values;
        }
      );

      return { game: payload.game, categories: categories };
    } catch (error) {
      throw new Error(
        `Failed to get item sub categories data: ${error.message}`
      );
    }
  }
);

export const getItemProperties = createAsyncThunk(
  "item/getItemProperties",
  async (payload: GetItemPropertiesPayload) => {
    try {
      const { data } = await client.query({
        query: GET_ITEM_PROPERTIES_QUERY,
        variables: {
          game: payload.game,
        },
      });

      return { game: payload.game, properties: data.itemProperties };
    } catch (error) {
      throw new Error(`Failed to get item properties data: ${error.message}`);
    }
  }
);
