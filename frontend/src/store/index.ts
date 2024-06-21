import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@store/auth/auth.slice";
import userReducer from "@store/user/user.slice";
import gameReducer from "@store/game/game.slice";
import itemReducer from "@store/item/item.slice";
import listingReducer from "@store/listing/listing.slice";
import scamReportReducer from "@store/scamReport/scamReport.slice";
import tradeReducer from "@store/trade/trade.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    game: gameReducer,
    item: itemReducer,
    listing: listingReducer,
    scamReport: scamReportReducer,
    trade: tradeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
