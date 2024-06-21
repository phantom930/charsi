import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "@/graphql";
import { CREATE_NEW_SCAM_REPORT_MUTATION } from "./scamReport.graphql";

export const createNewScamReport = createAsyncThunk(
  "scamReport/createNewScamReport",
  async (payload: {
    data: object;
    onSuccess?: Function | null;
    onFail?: Function | null;
  }) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_NEW_SCAM_REPORT_MUTATION,
        variables: { data: payload.data },
      });

      payload.onSuccess && payload.onSuccess();

      return data.createNewScamReport.scamReport;
    } catch (error) {
      payload.onFail && payload.onFail(error);
      throw new Error(error);
    }
  }
);
