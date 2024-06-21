import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";

import ViewLiveTradeFeeds from "@base/Button/ViewLiveTradeFeeds";
import LiveTradeFeed from "./components/LiveTradeFeed";
import GameSelector from "./components/GameSelector";
import GradientBox from "./components/GradientBox";
import TradeListingGroup from "./components/TradeListingGroup";

import DefaultLayout from "@layouts/DefaultLayout";

export default function Home() {
  const theme = useTheme();
  const breakpoints_md = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <GradientBox />
      <GameSelector />

      <Grid container justifyContent="center" px={2}>
        <ViewLiveTradeFeeds
          fullWidth={breakpoints_md}
          minWidth={breakpoints_md ? 0 : 300}
        />
      </Grid>

      <LiveTradeFeed />

      <Container maxWidth="lg" sx={{ marginBottom: 8 }}>
        <Typography variant="h5" mt={12} mb={5} color="grey">
          Some listings you may like
        </Typography>
        <TradeListingGroup />
      </Container>
    </>
  );
}

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
