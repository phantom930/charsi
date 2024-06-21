import React, {
  useMemo,
  useEffect,
  useState,
  useContext,
  Fragment,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Tabs from "@mui/material/Tabs";
import Pagination from "@mui/material/Pagination";
import SvgIcon from "@mui/material/SvgIcon";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import _ from "lodash";

import DefaultLayout from "@layouts/DefaultLayout";
import RoundButton from "@base/Button/RoundBtn";
import StatusBadge from "@base/Badge/StatusBadge";
import FullHeightSkeleton from "@base/Skeleton";
import { TabPanel, StyledTab } from "@base/Tab";
import GameAccounts from "@components/Account/Settings/GameAccounts";
import FilterOptions from "@components/Category/FilterOptions";
import Listing from "@components/Listing/Listing";
import QuickView from "@components/Listing/QuickView";
import { ReversedSearchInput as SearchInput } from "@modules/Appbar/Appbar.style";
import { CharsiContext } from "@providers/CharsiProvider";
import { getUserByUsername } from "@store/user/user.api";
import BalanceIcon from "@styles/icons/balance.svg";
import { createTemporaryChatRoom } from "@store/user/user.slice";
import type { UserQueryData } from "@store/user/user.slice";
import type { GameQueryData } from "@store/game/game.slice";
import type {
  ListingQueryData,
  ListingRewardQueryData,
  RewardQueryData,
} from "@store/listing/listing.slice";
import type { RootState, AppDispatch } from "@/store";
import { listingsPerPage } from "@/config";

const ProfileContainer = styled(Container)(({ theme }) => ({
  transform: "skewY(-1deg) translateY(-30px)",
  background: theme.palette.gradient.light,
}));

const UserProfile = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user);
  const {
    labels,
    shouldRefreshListings,
    setIsShowLoadingScreen,
    getListingsData,
    countListingsData,
  } = useContext(CharsiContext);
  const [filter, setFilter] = useState<object>({});
  const [countOfListings, setCountOfListings] = useState<number>(1);
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
  const [isNoListing, setIsNoListing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [tabIndex, setTabIndex] = useState(0);
  const [pattern, setPattern] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const user: UserQueryData | null = useMemo(() => {
    if (router.query?.user) {
      if (router.query?.user) {
        return userState.users.find(
          (user: UserQueryData) => user.username === router.query?.user
        );
      }
    }
    return null;
  }, [userState.users, router]);

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
    console.log("filter: ", filter);
    setIsShowLoadingScreen(true);
    setFilter(filter);
  };

  const loadListings = async () => {
    try {
      const count = await countListingsData(
        {
          owner: user.id,
          ...filter,
        },
        "network-only"
      );

      setCountOfListings(count);

      let where = {
        _and: [
          {
            _or: [
              {
                owner: user.id,
              },
              {
                bids: {
                  owner: user.id,
                },
              },
            ],
          },
        ],
      };
      let additionalWhere = {
        _or: [],
      };

      if (!_.isEmpty(filter)) {
        for (let key in filter) {
          const value = filter[key];
          if (key === "itemMajorCategory") {
            additionalWhere._or.push({
              listings: {
                item: {
                  item_major_category: {
                    id_in: value,
                  },
                },
              },
            });
          }

          if (key === "itemProperty") {
            value.forEach((itemProperty: string) => {
              additionalWhere._or.push({
                listings: {
                  values_contains: itemProperty,
                },
              });
              additionalWhere._or.push({
                rewards: {
                  values_contains: itemProperty,
                },
              });
            });
          }

          if (key === "rewardGame") {
            additionalWhere._or.push({
              rewards: {
                game_in: value,
              },
            });
          }

          if (key === "seekingBalance") {
            additionalWhere._or.push({
              rewards: Object.assign(
                {},
                value.min
                  ? {
                      balance_gte: value.min,
                    }
                  : {},
                value.max
                  ? {
                      balance_lte: value.max,
                    }
                  : {}
              ),
            });
          }
        }

        where._and.push(additionalWhere);
      }

      const res = await getListingsData(
        {
          where: where,
          start: (page - 1) * listingsPerPage,
          limit: listingsPerPage,
        },
        "network-only"
      );
      setListingRewards(res);
      setIsNoListing(res.length === 0);
      setIsShowLoadingScreen(false);
    } catch (error) {
      console.log(error);
      setIsShowLoadingScreen(false);
    }
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
    }
  };

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newTabIndex: number
  ) => {
    setTabIndex(newTabIndex);
  };

  const handleSendMessageToUser = () => {
    if (!authState.id) {
      enqueueSnackbar(labels.LOGIN_REQUIRED_MESSAGE, { variant: "error" });

      return;
    }
    if (user) {
      setIsShowLoadingScreen(true);
      dispatch(
        createTemporaryChatRoom({
          senderID: authState.id,
          recipientID: user.id,
          type: "DM",
          callback: (id: string) => {
            router.push(`/chat#${id}`);
          },
        })
      );
    }
  };

  useEffect(() => {
    setIsShowLoadingScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (user) await loadListings();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefreshListings, page, filter, user]);

  useEffect(() => {
    if (router.query?.user) {
      dispatch(
        getUserByUsername({
          username: router.query?.user as string,
          onSuccess: () => {
            setIsShowLoadingScreen(false);
          },
        })
      );
    }
  }, [router.query?.user, router, dispatch, setIsShowLoadingScreen]);

  return (
    <Fragment>
      <Box sx={{ overflow: "hidden" }}>
        <ProfileContainer maxWidth={false} disableGutters={true}>
          <Container
            maxWidth="xl"
            disableGutters
            sx={{ py: 4, transform: "skewY(1deg)" }}
          >
            <Grid container mt={2}>
              {_.get(user, "id", "user") === authState.id && (
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    textTransform="uppercase"
                    display="flex"
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                  >
                    Edit Background
                    <EditIcon fontSize="small" sx={{ ml: 1 }} />
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} display="flex">
                <Stack direction="column" alignItems="center" spacing={1}>
                  {user ? (
                    <>
                      {user.premium ? (
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          badgeContent={
                            <Image
                              alt="premium"
                              src="/icons/logo_gradient.svg"
                              width={32}
                              height={32}
                            />
                          }
                        >
                          <Avatar
                            alt={user.username}
                            src={user.avatar.url}
                            sx={{ width: 120, height: 120 }}
                          />
                        </Badge>
                      ) : (
                        <Avatar
                          alt={user.username}
                          src={user.avatar.url}
                          sx={{ width: 120, height: 120 }}
                        />
                      )}
                    </>
                  ) : (
                    <Skeleton variant="circular" width={120} height={120} />
                  )}

                  <Typography
                    variant="h4"
                    color="green"
                    fontWeight={600}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <SvgIcon fontSize="large" sx={{ mr: 1 }}>
                      <BalanceIcon />
                    </SvgIcon>
                    {user ? (
                      Number(user.balance).toFixed(2)
                    ) : (
                      <FullHeightSkeleton variant="text" width={100} />
                    )}
                  </Typography>
                </Stack>
                <Stack
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-end"
                  spacing={1}
                  ml={3}
                >
                  <Typography
                    variant="h4"
                    fontWeight={500}
                    display="flex"
                    alignItems="center"
                  >
                    {user ? (
                      <>
                        {user.username}
                        <StatusBadge color="success" sx={{ ml: 2 }} />
                      </>
                    ) : (
                      <FullHeightSkeleton variant="text" width={250} />
                    )}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    display="flex"
                    alignItems="center"
                    fontWeight={600}
                  >
                    {user ? (
                      <>
                        {user.trades} trades |{" "}
                        <StarIcon sx={{ fontSize: 17 }} />
                        <StarIcon sx={{ fontSize: 17 }} />
                        <StarIcon sx={{ fontSize: 17 }} />
                        <StarIcon sx={{ fontSize: 17 }} />
                        <StarIcon sx={{ fontSize: 17 }} />
                      </>
                    ) : (
                      <FullHeightSkeleton variant="text" width={200} />
                    )}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="grey"
                    display="flex"
                    alignItems="center"
                  >
                    {user ? (
                      <>
                        member since{" "}
                        {format(new Date(user.created_at), "MMM. dd, yyyy")}
                      </>
                    ) : (
                      <FullHeightSkeleton variant="text" width={200} />
                    )}
                  </Typography>
                  {_.get(user, "id", "user") !== authState.id && (
                    <Stack direction="row" spacing={2}>
                      <RoundButton
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessageToUser}
                      >
                        Send Message
                        <SendIcon fontSize="small" sx={{ ml: 1 }} />
                      </RoundButton>
                      <RoundButton variant="outlined" color="secondary">
                        Follow (52)
                        <FavoriteBorderIcon
                          fontSize="small"
                          color="secondary"
                          sx={{ ml: 1 }}
                        />
                      </RoundButton>
                      <RoundButton variant="contained" color="secondary">
                        Report User
                        <EmojiFlagsIcon fontSize="small" sx={{ ml: 1 }} />
                      </RoundButton>
                    </Stack>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} mt={3}>
                {user ? (
                  <GameAccounts
                    gameAccounts={user.gameAccounts}
                    isForAuth={false}
                    isItemEditable={false}
                    isShowLabel={false}
                  />
                ) : (
                  <FullHeightSkeleton
                    variant="rectangular"
                    width={500}
                    height={30}
                  />
                )}
              </Grid>
              <Grid item xs={12} mt={3}>
                <Stack
                  direction="row"
                  spacing={2}
                  display="flex"
                  alignItems="center"
                >
                  <Typography color="grey" variant="h6">
                    Games played
                  </Typography>
                  {user && user.games.length > 0
                    ? user.games.map((game: GameQueryData) => (
                        <Avatar
                          key={game.id}
                          src={game.image.url}
                          alt={game.title}
                          sx={{ width: 32, height: 32 }}
                        />
                      ))
                    : !user && <FullHeightSkeleton width={200} height={32} />}
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </ProfileContainer>
      </Box>
      <Container maxWidth="xl" sx={{ py: 3 }}>
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
        </Tabs>
        <TabPanel value={0} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FilterOptions onFilterChange={handleFilterChange} />
            </Grid>
            <Grid item xs={12} md={9}>
              <SearchInput
                value={pattern}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPattern(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Search for items or users associated with one of your listings"
                style={{ marginBottom: 24 }}
              />
              {isNoListing ? (
                <Typography variant="h4" align="center">
                  No listings data
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  <QuickView
                    open={openQuickView}
                    onClose={() => setOpenQuickView(false)}
                    listings={quickViewerListings}
                    rewards={quickViewerRewards}
                  />
                  {listingRewards.length > 0
                    ? listingRewards.map((listing: ListingRewardQueryData) => (
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
                      ))
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
              )}
              <Pagination
                count={Math.ceil(countOfListings / listingsPerPage)}
                defaultPage={Math.ceil(countOfListings / listingsPerPage / 2)}
                size="large"
                page={page}
                onChange={handleChangePage}
                sx={{ mt: 7 }}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Fragment>
  );
};

UserProfile.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default UserProfile;
