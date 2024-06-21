import { gql } from "@apollo/client";

import { USER_PAYLOAD } from "@store/user/user.graphql";
import { UPLOAD_FILE_PAYLOAD } from "@store/listing/listing.graphql";
import { TRADE_PAYLOAD } from "@store/trade/trade.graphql";

export const SCAM_REPORT_PAYLOAD = `
  id
  accusedUser {
    ${USER_PAYLOAD}
  }
  reporter {
    ${USER_PAYLOAD}
  }
  trade {
    ${TRADE_PAYLOAD}
  }
  reason
  proofs {
    ${UPLOAD_FILE_PAYLOAD}
  }
  status
  supportReply
  created_at
  updated_at
`;

export const CREATE_NEW_SCAM_REPORT_MUTATION = gql`
  mutation CreateScamReport($data: NewScamReportInput) {
    createNewScamReport(input: { data: $data }) {
      scamReport {
        ${SCAM_REPORT_PAYLOAD}
      }
    }
  }
`;
