import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typograpy from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";

import Blockquote from "@base/Typography/Blockquote";
import { TabPanel, StyledTab } from "@base/Tab";
import FilterOptions from "@components/Category/FilterOptions";
import Listing from "@components/Listing/Listing";
import QuickView from "@components/Listing/QuickView";
import PastTradesSearch from "@components/Search/PastTrades";
import UsersSearch from "@components/Search/Users";
import { CharsiContext } from "@providers/CharsiProvider";
import type {
  ListingQueryData,
  ListingRewardQueryData,
  RewardQueryData,
} from "@store/listing/listing.slice";
import DefaultLayout from "@layouts/DefaultLayout";

const Search = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [listingRewards, setListingRewards] = useState<
    ListingRewardQueryData[]
  >([]);
  const [openQuickView, setOpenQuickView] = useState<boolean>(false);
  const [quickViewerListings, setQuickViewerListings] = useState<
    ListingQueryData[]
  >([]);
  const [quickViewerRewards, setQuickViewerRewards] = useState<
    RewardQueryData[]
  >([]);
  const router = useRouter();
  const { pattern } = router.query;
  const { searchListingRewardByTitle } = useContext(CharsiContext);

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newTabIndex: number
  ) => {
    setTabIndex(newTabIndex);
  };

  const handleGoQuickViewer = (
    listings: ListingQueryData[],
    rewards: RewardQueryData[]
  ) => {
    setQuickViewerListings(listings);
    setQuickViewerRewards(rewards);
    setOpenQuickView(true);
  };

  useEffect(() => {
    (async () => {
      if (pattern) {
        const res = await searchListingRewardByTitle(pattern as string);
        setListingRewards(res);
      }
    })();
  }, [pattern, searchListingRewardByTitle]);

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack direction="row" alignItems="center">
        <Typograpy variant="h4" component="h1" align="center" sx={{ mr: 2 }}>
          Search results for
        </Typograpy>
        <Blockquote variant="h4" fontWeight={600}>
          {pattern}
        </Blockquote>
      </Stack>
      <Stack mt={5}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="icon position tabs example"
        >
          <StyledTab
            label="Active listings"
            sx={{
              textTransform: "capitalize",
              fontSize: "20px",
              fontWeight: 400,
            }}
          />
          <StyledTab
            label="Past Trades"
            sx={{
              textTransform: "capitalize",
              fontSize: "20px",
              fontWeight: 400,
            }}
          />
          <StyledTab
            label="Users"
            sx={{
              textTransform: "capitalize",
              fontSize: "20px",
              fontWeight: 400,
            }}
          />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={12} md={3}>
              <FilterOptions onFilterChange={() => {}} />
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                <QuickView
                  open={openQuickView}
                  onClose={() => setOpenQuickView(false)}
                  listings={quickViewerListings}
                  rewards={quickViewerRewards}
                />
                {listingRewards.length === 0 && (
                  <Typograpy
                    variant="h4"
                    component="h1"
                    align="center"
                    width="100%"
                  >
                    No results found
                  </Typograpy>
                )}
                {listingRewards.map((listing: ListingRewardQueryData) => (
                  <Grid
                    key={listing.id}
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    sx={{ mb: 5 }}
                  >
                    <Listing
                      listing={listing}
                      onQuickView={handleGoQuickViewer}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <PastTradesSearch pattern={pattern as string} />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <UsersSearch pattern={pattern as string} />
        </TabPanel>
      </Stack>
    </Container>
  );
};

Search.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default Search;
