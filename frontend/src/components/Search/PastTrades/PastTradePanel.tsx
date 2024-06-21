import { useContext, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { format, formatDistance } from "date-fns";
import _ from "lodash";

import Panel from "@base/Panel";
import UserPanel from "@base/Panel/UserPanel";
import ViewerContent from "@components/Listing/QuickView/ViewerContent";
import { CharsiContext } from "@providers/CharsiProvider";
import type {
  ListingQueryData,
  RewardQueryData,
} from "@store/listing/listing.slice";
import type { UserQueryData } from "@store/user/user.slice";

const PastTradePanel = ({ trade }) => {
  const [listings, setListings] = useState<ListingQueryData[]>([]);
  const [rewards, setRewards] = useState<RewardQueryData[]>([]);
  const [listingOwner, setListingOwner] = useState<UserQueryData>(null);
  const [bidOwner, setBidOwner] = useState<UserQueryData>(null);
  const { getUserByID, getMultipleListings, getMultipleRewards } =
    useContext(CharsiContext);

  useMemo(async () => {
    if (!trade.listing_reward || !trade.bid) return;

    const listingIDs = trade.listing_reward.listings.map(
      (listing: ListingQueryData) => listing.id
    );
    const rewardIDs = trade.listing_reward.rewards.map(
      (reward: RewardQueryData) => reward.id
    );
    setListings(await getMultipleListings(listingIDs));
    setRewards(await getMultipleRewards(rewardIDs));
    setListingOwner(await getUserByID(trade.listing_reward.owner.id));
    setBidOwner(await getUserByID(trade.bid.owner.id));
  }, [
    trade.listing_reward,
    trade.bid,
    getMultipleListings,
    getMultipleRewards,
    getUserByID,
  ]);

  return (
    <Panel px={4} py={3}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack spacing={3}>
            <Typography variant="h4" fontWeight={600} alignItems="center">
              {trade.listing_reward.title}
            </Typography>

            <Stack direction="row" alignItems="center">
              <Typography
                variant="subtitle1"
                fontWeight={trade.status === "TRADING" ? 600 : 500}
                color="text.secondary"
              >
                {trade.status === "TRADING"
                  ? "trade not completed •"
                  : `trade completed ${formatDistance(
                      new Date(trade.updated_at),
                      new Date()
                    )} ago`}
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                ml={1}
                color="text.secondary"
              >
                listing created{" "}
                {format(
                  new Date(trade.listing_reward.created_at),
                  "MMM. dd, yyyy @ h:mm a"
                )}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center">
              <UserPanel user={listingOwner} />
              <ArrowForwardIcon sx={{ mx: 2, color: "rgba(0, 0, 0, 0.6)" }} />
              <UserPanel user={bidOwner} />
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} display="flex" mt={4}>
          <ViewerContent listings={listings} listingLabel="Items to be Given" />
          <ViewerContent rewards={rewards} rewardLabel="Items to be Received" />
        </Grid>
      </Grid>
    </Panel>
  );
};

export default PastTradePanel;
