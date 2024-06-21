import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  getItems,
  getItemMajorCategoriesByGame,
  getItemMinorCategories,
  getItemSubCategories,
  getItemProperties,
} from "./item.api";

interface ItemCategoryQueryData {
  id: string;
  name: string;
}

export interface ItemMajorCategoryQueryData extends ItemCategoryQueryData {
  isItemType: boolean;
}
export interface ItemMinorCategoryQueryData extends ItemCategoryQueryData {
  suzerainMajorCategories: ItemMajorCategoryQueryData[];
}
export interface ItemSubCategoryQueryData extends ItemMinorCategoryQueryData {}
export interface ItemPropertyQueryData extends ItemMinorCategoryQueryData {
  propertyType: "NUMBER" | "STRING";
}
export interface ItemQueryData {
  id: string;
  name: string;
  majorCategory?: ItemMajorCategoryQueryData;
  image?: {
    id: string;
    url: string;
  };
  properties: ItemPropertyQueryData[];
}

export interface ItemMajorCategoryQueryDataByGame {
  [key: string]: ItemMajorCategoryQueryData[];
}
export interface ItemMinorCategoryQueryDataByGame {
  [key: string]: ItemMinorCategoryQueryData[];
}
export interface ItemSubCategoryQueryDataByGame {
  [key: string]: {
    [key: string]: ItemSubCategoryQueryData[];
  };
}
export interface ItemProperitesQueryDataByGame {
  [key: string]: ItemPropertyQueryData[];
}
export interface ItemQueryDataByGame {
  [key: string]: {
    [key: string]: ItemQueryData[];
  };
}

interface GetItemCategoriesSuccessPayload {
  game: string;
  categories: ItemCategoryQueryData[];
}
export interface GetItemsSuccessPayload {
  game: string;
  itemMajorCategory: string;
  items: ItemQueryData[];
}
export interface GetItemMajorCategoriesSuccessPayload
  extends GetItemCategoriesSuccessPayload {
  categories: ItemMajorCategoryQueryData[];
}
export interface GetItemMinorCategoriesSuccessPayload
  extends GetItemCategoriesSuccessPayload {
  categories: ItemMinorCategoryQueryData[];
}
export interface GetItemSubCategoriesSuccessPayload {
  game: string;
  categories: {
    [key: string]: ItemSubCategoryQueryData[];
  };
}
export interface GetItemPropertiesSuccessPayload {
  game: string;
  properties: ItemPropertyQueryData[];
}

export interface InitialItemState {
  items: ItemQueryDataByGame;
  itemMajorCategories: ItemMajorCategoryQueryDataByGame;
  itemMinorCategories: ItemMinorCategoryQueryDataByGame;
  itemSubCategories: ItemSubCategoryQueryDataByGame;
  itemProperties: ItemProperitesQueryDataByGame;
  isItemMajorCategoriesLoading: boolean;
  isItemMinorCategoriesLoading: boolean;
  isItemSubCategoriesLoading: boolean;
  isItemPropertiesLoading: boolean;
}

const initialState: InitialItemState = {
  items: {},
  itemMajorCategories: {},
  itemMinorCategories: {},
  itemSubCategories: {},
  itemProperties: {},
  isItemMajorCategoriesLoading: false,
  isItemMinorCategoriesLoading: false,
  isItemSubCategoriesLoading: false,
  isItemPropertiesLoading: false,
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getItems.fulfilled,
        (state, { payload }: PayloadAction<GetItemsSuccessPayload>) => {
          if (!state.items[payload.game]) state.items[payload.game] = {};
          state.items[payload.game][payload.itemMajorCategory] =
            payload.items || [];
        }
      )
      .addCase(getItemMajorCategoriesByGame.pending, (state) => {
        state.isItemMajorCategoriesLoading = true;
      })
      .addCase(
        getItemMajorCategoriesByGame.fulfilled,
        (
          state,
          { payload }: PayloadAction<GetItemMajorCategoriesSuccessPayload>
        ) => {
          state.itemMajorCategories[payload.game] = [...payload.categories];
          state.isItemMajorCategoriesLoading = false;
        }
      )
      .addCase(getItemMajorCategoriesByGame.rejected, (state) => {
        state.isItemMajorCategoriesLoading = false;
      })
      .addCase(getItemMinorCategories.pending, (state) => {
        state.isItemMinorCategoriesLoading = true;
      })
      .addCase(
        getItemMinorCategories.fulfilled,
        (
          state,
          { payload }: PayloadAction<GetItemMinorCategoriesSuccessPayload>
        ) => {
          state.itemMinorCategories[payload.game] = [...payload.categories];
          state.isItemMinorCategoriesLoading = false;
        }
      )
      .addCase(getItemMinorCategories.rejected, (state) => {
        state.isItemMinorCategoriesLoading = false;
      })
      .addCase(getItemSubCategories.pending, (state) => {
        state.isItemSubCategoriesLoading = true;
      })
      .addCase(
        getItemSubCategories.fulfilled,
        (
          state,
          { payload }: PayloadAction<GetItemSubCategoriesSuccessPayload>
        ) => {
          state.itemSubCategories[payload.game] = { ...payload.categories };
          state.isItemSubCategoriesLoading = false;
        }
      )
      .addCase(getItemSubCategories.rejected, (state) => {
        state.isItemSubCategoriesLoading = false;
      })
      .addCase(getItemProperties.pending, (state) => {
        state.isItemPropertiesLoading = true;
      })
      .addCase(
        getItemProperties.fulfilled,
        (
          state,
          { payload }: PayloadAction<GetItemPropertiesSuccessPayload>
        ) => {
          state.itemProperties[payload.game] = [...payload.properties];
          state.isItemPropertiesLoading = false;
        }
      )
      .addCase(getItemProperties.rejected, (state) => {
        state.isItemPropertiesLoading = false;
      });
  },
});

export default itemSlice.reducer;
