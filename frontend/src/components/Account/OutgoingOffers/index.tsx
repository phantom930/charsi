import {
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";

import OutgoingOfferPanel from "./OutgoingOfferPanel";
import FilterOptions from "@components/Category/FilterOptions";
import { ReversedSearchInput as SearchInput } from "@modules/Appbar/Appbar.style";
import { CharsiContext } from "@providers/CharsiProvider";
import type { ExtendedListingRewardQueryData } from "./OutgoingOfferPanel";
import type { RootState } from "@/store";

const OutgoingOffers = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const { labels, setIsShowLoadingScreen, getMyOutgoingBids } =
    useContext(CharsiContext);
  const [pattern, setPattern] = useState<string>("");
  const [listingRewards, setListingRewards] = useState<
    ExtendedListingRewardQueryData[]
  >([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!authState.id) {
        enqueueSnackbar(labels.WARNING_REQUIRED_SIGNIN_MESSAGE, {
          variant: "error",
        });
        return;
      }
      const res = await getMyOutgoingBids(authState.id as string);
      setListingRewards(res);
    }
  };

  useEffect(() => {
    setIsShowLoadingScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (authState.id) {
          const res = await getMyOutgoingBids(authState.id as string);
          setIsShowLoadingScreen(false);
          setListingRewards(res);
        }
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
        setIsShowLoadingScreen(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.id]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <FilterOptions onFilterChange={() => {}} />
      </Grid>
      <Grid item xs={12} md={9}>
        <SearchInput
          value={pattern}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPattern(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Search for items or users associated with one of your bids"
        />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {listingRewards.length > 0 ? (
            listingRewards.map(
              (
                listingReward: ExtendedListingRewardQueryData,
                index: number
              ) => <OutgoingOfferPanel key={index} data={listingReward} />
            )
          ) : (
            <Grid item sm={12}>
              <Typography variant="h4" gutterBottom textAlign="center">
                No outgoing offers yet
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OutgoingOffers;
