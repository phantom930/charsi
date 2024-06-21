import {
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "notistack";

import BidOnItemPanel from "./BidOnItemPanel";
import FilterOptions from "@components/Category/FilterOptions";
import { ReversedSearchInput as SearchInput } from "@modules/Appbar/Appbar.style";
import { CharsiContext } from "@providers/CharsiProvider";
import { searchMyListingRewardByPattern } from "@store/listing/listing.api";
import type { RootState, AppDispatch } from "@/store";

const BidsOnItems = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const { labels, setIsShowLoadingScreen } = useContext(CharsiContext);
  const [pattern, setPattern] = useState<string>("");
  const [listingRewards, setListingRewards] = useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch: AppDispatch = useDispatch();

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!authState.id) {
        enqueueSnackbar(labels.WARNING_REQUIRED_SIGNIN_MESSAGE, {
          variant: "error",
        });
        return;
      }
      // const res = await searchMyListingRewardByPattern(
      //   pattern as string,
      //   authState.id as string
      // );
      // setListingRewards(res);
    }
  };

  useEffect(() => {
    setIsShowLoadingScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authState.id) {
      dispatch(
        searchMyListingRewardByPattern({
          pattern: pattern as string,
          owner: authState.id as string,
          onSuccess: (listingRewardIDs) => {
            setListingRewards(listingRewardIDs);
            setIsShowLoadingScreen(false);
          },
          onFail: (error) => {
            enqueueSnackbar(error.message, { variant: "error" });
            setIsShowLoadingScreen(false);
          },
        })
      );
    }
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
          placeholder="Search for items or users associated with one of your listings"
        />
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {listingRewards.map((listingRewardID: string) => (
            <BidOnItemPanel
              key={listingRewardID}
              listingRewardID={listingRewardID}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BidsOnItems;
