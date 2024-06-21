import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

import { createNewScamReport } from "./scamReport.api";
import type { UploadFile } from "@store/listing/listing.slice";
import type { TradeQueryData } from "@store/trade/trade.slice";
import type { UserQueryData } from "@store/user/user.slice";

export interface ScamReportQueryData {
  id: string;
  accusedUser: UserQueryData;
  reporter: UserQueryData;
  trade: TradeQueryData;
  reason: string;
  proofs: UploadFile[];
  status: "REVIEW" | "COMPLETED";
  supportReply: string;
  created_at: Date;
  updated_at: Date;
}

interface InitialScamReportState {
  scamReports: ScamReportQueryData[] | [];
}

const initialState: InitialScamReportState = {
  scamReports: [],
};

export const scamReportSlice = createSlice({
  name: "scamReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      createNewScamReport.fulfilled,
      (state, { payload }: PayloadAction<ScamReportQueryData>) => {
        state.scamReports = [...state.scamReports, payload];
      }
    );
  },
});

export default scamReportSlice.reducer;
