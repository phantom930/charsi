/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useContext, Fragment, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import _ from "lodash";

import DefaultLayout from "@layouts/DefaultLayout";
import FullHeightSkeleton from "@base/Skeleton";
import GameCover from "@components/Category/GameCover";
import FilterOptions from "@components/Category/FilterOptions";
import Listing from "@components/Listing/Listing";
import QuickView from "@components/Listing/QuickView";
import GameLiveTradeFeed from "@modules/Main/GameLiveTradeFeed";
import CommunityBar from "@modules/Footer/CommunityBar";
import { CharsiContext } from "@providers/CharsiProvider";
import type { GameQueryData } from "@store/game/game.slice";
import type {
  ListingQueryData,
  ListingRewardQueryData,
  RewardQueryData,
} from "@store/listing/listing.slice";
import { uriIdGenerator } from "@/helpers";
import { listingsPerPage } from "@/config";
import type { RootState } from "@/store";

const Category = () => {
  const gameState = useSelector((state: RootState) => state.game);
  const [filter, setFilter] = useState<object>({});
  const [countOfListings, setCountOfListings] = useState<number>(1);
  const [listingRewards, setListingRewards] = useState<
    ListingRewardQueryData[]
  >([]);
  const [selectedGame, setSelectedGame] = useState<GameQueryData>(null);
  const [openQuickView, setOpenQuickView] = useState<boolean>(false);
  const [quickViewerListings, setQuickViewerListings] = useState<
    ListingQueryData[]
  >([]);
  const [quickViewerRewards, setQuickViewerRewards] = useState<
    RewardQueryData[]
  >([]);
  const [isNoListing, setIsNoListing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const {
    shouldRefreshListings,
    setIsShowLoadingScreen,
    getGamesData,
    getListingsData,
    countListingsData,
  } = useContext(CharsiContext);
  const router = useRouter();

  const handleGoQuickViewer = (
    listings: ListingQueryData[],
    rewards: RewardQueryData[]
  ) => {
    setQuickViewerListings(listings);
    setQuickViewerRewards(rewards);
    setOpenQuickView(true);
  };

  const handleChangePage = (_event: ChangeEvent<unknown>, value: number) => {
    setIsShowLoadingScreen(true);
    setPage(value);
  };

  const handleFilterChange = (filter: object) => {
    setIsShowLoadingScreen(true);
    setFilter(filter);
  };

  const loadListings = async () => {
    try {
      if (!selectedGame) return;

      const count = await countListingsData(
        {
          game: Number(selectedGame.id),
          ...filter,
          start: (page - 1) * listingsPerPage,
          limit: listingsPerPage,
        },
        "network-only"
      );

      if (count.total) {
        setCountOfListings(count.total);

        const res = await getListingsData(
          {
            where: {
              id_in: count.IDs,
            },
          },
          "network-only"
        );
        setListingRewards(res);
        setIsNoListing(res.length === 0);
      } else {
        setCountOfListings(1);
        setListingRewards([]);
        setIsNoListing(true);
      }
      setIsShowLoadingScreen(false);
    } catch (error) {
      console.log(error);
      setIsShowLoadingScreen(false);
    }
  };

  useEffect(() => {
    setIsShowLoadingScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getGamesData();
  }, [getGamesData]);

  useEffect(() => {
    (async () => {
      await loadListings();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame, shouldRefreshListings, page, filter]);

  useEffect(() => {
    if (router.query?.game && gameState.games) {
      const game: GameQueryData = gameState.games.find(
        (game: GameQueryData) =>
          router.query?.game === uriIdGenerator(game.title)
      );
      setSelectedGame(game || null);
    }
  }, [router.query, gameState.games]);

  return (
    <Container maxWidth={false} disableGutters={true}>
      <Fragment>
        <GameCover
          cover={{
            url: _.get(selectedGame, "cover.url", ""),
            alt: _.get(selectedGame, "cover.name", ""),
          }}
          logo={{
            url: _.get(selectedGame, "logo.url", ""),
            alt: _.get(selectedGame, "logo.name", ""),
          }}
        />
        <Container maxWidth="xl" sx={{ mt: 13 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FilterOptions
                isForGame
                gameID={_.get(selectedGame, "id", null)}
                onFilterChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              {isNoListing ? (
                <Typography variant="h4" align="center">
                  No listings data
                </Typography>
              ) : (
                <>
                  <Grid container spacing={3}>
                    <QuickView
                      open={openQuickView}
                      onClose={() => setOpenQuickView(false)}
                      listings={quickViewerListings}
                      rewards={quickViewerRewards}
                    />
                    {listingRewards.length > 0
                      ? listingRewards.map(
                          (listing: ListingRewardQueryData) => (
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
                          )
                        )
                      : [...Array(3)].map((_, index) => (
                          <Grid
                            key={index}
                            item
                            xs={12}
                            md={6}
                            lg={4}
                            sx={{ mb: 5 }}
                          >
                            <FullHeightSkeleton height={600} />
                          </Grid>
                        ))}
                  </Grid>

                  <Pagination
                    count={Math.ceil(countOfListings / listingsPerPage)}
                    defaultPage={Math.ceil(
                      countOfListings / listingsPerPage / 2
                    )}
                    size="large"
                    page={page}
                    onChange={handleChangePage}
                    sx={{ mt: 7 }}
                  />
                </>
              )}
            </Grid>
          </Grid>
        </Container>
      </Fragment>
      {selectedGame && (
        <GameLiveTradeFeed gameID={selectedGame.id} sx={{ mt: 7 }} />
      )}
      <CommunityBar />
    </Container>
  );
};

Category.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default Category;
