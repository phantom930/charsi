import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { getGames } from "./game.api";

export interface GameQueryData {
  id: string;
  title: string;
  image?: {
    id: string;
    url: string;
  };
  cover?: {
    id: string;
    name: string;
    url: string;
  };
  logo?: {
    id: string;
    name: string;
    url: string;
  };
}

export interface InitialGameState {
  games: GameQueryData[] | [];
}

const initialState: InitialGameState = {
  games: [],
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getGames.fulfilled,
        (state, { payload }: PayloadAction<[GameQueryData]>) => {
          state.games = payload || [];
        }
      )
      .addCase(getGames.rejected, (state) => {
        state.games = [];
      });
  },
});

export default gameSlice.reducer;
