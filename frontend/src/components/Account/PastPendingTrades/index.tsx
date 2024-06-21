import { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

import TradePanel from "./TradePanel";
import { ReversedSearchInput as SearchInput } from "@modules/Appbar/Appbar.style";
import { CharsiContext } from "@providers/CharsiProvider";
import { getMyTrades } from "@store/trade/trade.api";
import type { TradeQueryData } from "@store/trade/trade.slice";
import type { RootState, AppDispatch } from "@/store";

const StyledChip = styled(Chip)({
  textTransform: "uppercase",
});

const PastPendingTrades = () => {
  const { setIsShowLoadingScreen } = useContext(CharsiContext);
  const { trades } = useSelector((state: RootState) => state.trade);
  const { id } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(
        getMyTrades({
          ownerID: id,
          onSuccess: () => setIsShowLoadingScreen(false),
          onFail: () => setIsShowLoadingScreen(false),
        })
      );
    }
  }, [dispatch, id, setIsShowLoadingScreen]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display="flex">
        <Typography
          variant="subtitle1"
          textTransform="uppercase"
          width="fit-content"
          display="flex"
          alignItems="center"
        >
          Filter by:
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          ml={3}
          alignItems="center"
          flexGrow={1}
        >
          <Typography
            variant="subtitle1"
            color="primary"
            textTransform="uppercase"
          >
            None
          </Typography>
          <StyledChip label="Items Traded" color="primary" />
          <StyledChip label="Items Received" color="secondary" />
          <StyledChip label="Trade in Progress" color="warning" />
          <SearchInput
            width="100%"
            placeholder="Search for items or users associated with any listing"
          />
        </Stack>
      </Grid>
      {trades.map((trade: TradeQueryData) => (
        <Grid item xs={12} key={trade.id}>
          <TradePanel trade={trade} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PastPendingTrades;
