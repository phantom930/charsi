import {
  useState,
  useEffect,
  useCallback,
  useContext,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { styled } from "@mui/styles";
import { formatDistance } from "date-fns";
import { useSnackbar } from "notistack";
import _ from "lodash";

import RoundButton from "@base/Button/RoundBtn";
import ViewerContent from "@components/Listing/QuickView/ViewerContent";
import BidPanel from "@components/Listing/AllBidsView/BidPanel";
import { ReversedSearchInput as SearchInput } from "@modules/Appbar/Appbar.style";
import { CharsiContext } from "@providers/CharsiProvider";
import type {
  ListingRewardQueryData,
  ListingQueryData,
  BidQueryData,
} from "@store/listing/listing.slice";
import type { UserQueryData } from "@store/user/user.slice";
import type { RootState } from "@/store";

export interface ExtendedListingRewardQueryData extends ListingRewardQueryData {
  myBidCreatedAt: Date;
}

interface OutgoingOfferPanelProps {
  data: ExtendedListingRewardQueryData;
}

const Panel = styled(Box)({
  width: "100%",
  backgroundColor: "#EEE",
  borderRadius: "8px",
  padding: "30px 20px",
});

const UserPanel = styled(Chip)({
  backgroundColor: "#E0E0E0",
  borderRadius: "8px",
  padding: "10px 5px",
  fontSize: "18px",
  color: "rgba(0, 0, 0, 0.6)",
});

const OutgoingOfferPanel = ({
  data: listingReward,
}: OutgoingOfferPanelProps) => {
  const { labels, getMultipleListings, getUserByID } =
    useContext(CharsiContext);
  const authState = useSelector((state: RootState) => state.auth);
  const [listings, setListings] = useState<ListingQueryData[]>([]);
  const [owner, setOwner] = useState<UserQueryData>(null);
  const [pattern, setPattern] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!authState.id) {
        enqueueSnackbar(labels.WARNING_REQUIRED_SIGNIN_MESSAGE, {
          variant: "error",
        });
        return;
      }
    }
  };
  const refresh = useCallback(async () => {
    if (
      listingReward === null ||
      listingReward.listings === undefined ||
      listingReward.owner === undefined
    )
      return;

    const listingIDs = listingReward.listings.map(
      (listing: ListingQueryData) => listing.id
    );

    setListings(await getMultipleListings(listingIDs));
    setOwner(await getUserByID(listingReward.owner.id));
  }, [listingReward, getMultipleListings, getUserByID]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Grid item xs={12}>
      <Panel>
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Typography variant="h4">{listingReward.title}</Typography>
            <RoundButton
              LinkComponent={Link}
              href={`/listing/${listingReward.id}`}
              variant="contained"
              color="primary"
            >
              View Listing
              <ArrowForwardIcon sx={{ ml: 1 }} />
            </RoundButton>
          </Grid>
          <Grid item xs={12} display="flex">
            <Stack direction="row" spacing={2}>
              <UserPanel
                label={_.get(owner, "username", "")}
                size="medium"
                avatar={
                  <Avatar
                    sx={{ width: 32, height: 32, mr: 2 }}
                    src={_.get(owner, "avatar.url", "")}
                    alt="avatar"
                  />
                }
              />
              <Typography variant="h6" color="grey">
                bid placed{" "}
                {formatDistance(
                  new Date(listingReward.myBidCreatedAt),
                  new Date()
                )}{" "}
                ago • listing created{" "}
                {formatDistance(new Date(listingReward.created_at), new Date())}{" "}
                ago
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} mt={5} display="flex" flexDirection="column">
            <Typography variant="h5">What I offered on</Typography>
            <ViewerContent isShowLabel={false} listings={listings} mt={3} />
          </Grid>
          <Grid item xs={12} mt={5} display="flex">
            <Typography variant="h5" sx={{ mr: 2 }}>
              Current bids ({listingReward.bids.length})
            </Typography>
            <SearchInput
              value={pattern}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPattern(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Search for items or users associated with a bid"
            />
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={2}>
              {listingReward.bids.map((bid: BidQueryData) => (
                <BidPanel
                  key={bid.id}
                  bid={bid}
                  onRetractMyBid={() => refresh()}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Panel>
    </Grid>
  );
};

export default OutgoingOfferPanel;
