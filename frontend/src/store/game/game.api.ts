import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "@/graphql";
import { GET_GAMES_QUERY } from "./game.graphql";

export const getGames = createAsyncThunk("game/getGames", async () => {
  try {
    const { data } = await client.query({
      query: GET_GAMES_QUERY,
    });

    return data.games;
  } catch (error) {
    throw new Error(`Failed to get games data: ${error.message}`);
  }
});
