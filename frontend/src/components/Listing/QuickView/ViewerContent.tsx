import { useCallback, useContext, useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useResizeDetector } from "react-resize-detector";
import Grid, { GridProps } from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip, { ChipProps } from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import SvgIcon from "@mui/material/SvgIcon";
import { useTheme } from "@mui/material/styles";
import _ from "lodash";

import ItemViewer from "./ItemViewer";
import FullHeightSkeleton from "@base/Skeleton";
import UserPanel from "@base/Panel/UserPanel";
import UpdateItemEditor from "@components/Listing/UpdateItem";
import VerticalSeparator from "@modules/Separator/VerticalSeparator";
import BalanceIcon from "@styles/icons/balance.svg";
import type {
  ListingQueryData,
  RewardQueryData,
} from "@store/listing/listing.slice";
import type { GameQueryData } from "@store/game/game.slice";
import type { ItemQueryData } from "@store/item/item.slice";
import type { UserQueryData } from "@store/user/user.slice";
import { CharsiContext } from "@/providers/CharsiProvider";
import { RootState } from "@/store";

interface ViewerContentProps extends GridProps {
  listingOwner?: UserQueryData | null;
  listings?: ListingQueryData[];
  rewards?: RewardQueryData[];
  isShowLabel?: boolean;
  isDark?: boolean;
  isBid?: boolean;
  isItemEditable?: boolean;
  listingLabel?: string;
  rewardLabel?: string;
  subCategorySx?: Object;
  refresh?: Function;
  isLoading?: boolean;
}

interface SubCategoryProps extends ChipProps {
  isDark?: boolean;
  style: Object;
}

interface ItemPanelProps extends ChipProps {
  isDark?: boolean;
}

export interface ExtendedListingQueryData extends ListingQueryData {
  listingType: "LISTING" | "REWARD";
}

const SubCategory = ({ isDark, style, ...rest }: SubCategoryProps) => {
  const sx: object = Object.assign(
    {
      width: 300,
      height: 36,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "4px 8px",
      textTransform: "uppercase",
      fontSize: 14,
      fontWeight: 500,
      background: isDark ? "#fff" : "rgba(0, 0, 0, 0.87)",
      borderRadius: 100,
      color: isDark ? "#000" : "#fff",
    },
    style
  );

  return <Chip sx={sx} {...rest} />;
};

const ItemPanel = ({ isDark, ...rest }: ItemPanelProps) => {
  const sx: object = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "fit-content",
    height: 32,
    padding: "4px 8px",
    background: "rgba(0, 0, 0, 0.12)",
    borderRadius: 8,
    textTransform: "uppercase",
    fontSize: 13,
    color: isDark ? "#fff" : "rgba(0, 0, 0, 0.6)",
    cursor: "pointer",
  };

  return <Chip sx={sx} {...rest} />;
};

const ViewerContent = ({
  listingOwner = null,
  listings = [],
  rewards = [],
  isShowLabel = true,
  isDark = false,
  isBid = false,
  isItemEditable = false,
  listingLabel = "What items are included in this listing",
  rewardLabel = "What the seller is looking for",
  subCategorySx = {},
  refresh,
  isLoading = false,
  ...props
}: ViewerContentProps) => {
  const gameSelector = (state: RootState) => state.game;
  const gameState = useSelector(gameSelector);
  const { getGamesData } = useContext(CharsiContext);
  const [isOpenUpdateItemEditor, setIsOpenUpdateItemEditor] =
    useState<boolean>(false);
  const [isOpenItemViewer, setIsOpenItemViewer] = useState<boolean>(false);
  const [selectedListing, setSelectedListing] =
    useState<ExtendedListingQueryData | null>(null);
  const { width, ref } = useResizeDetector();
  const theme = useTheme();
  const matches: boolean = width > theme.breakpoints.values.sm;

  const getGameByID = useCallback(
    (gameID: string) =>
      _.find(gameState.games, (game: GameQueryData) => game.id === gameID),
    [gameState.games]
  );

  const categorizedDataOfListing: any[] | [] = useMemo(() => {
    let categoryGames: any[] = [];
    listings.map((listing: ListingQueryData) => {
      const game = getGameByID(listing.game.id);

      if (!game) return null;

      const isIncluded =
        _.findIndex(
          categoryGames,
          (categoryGame) => categoryGame.id === game.id
        ) !== -1;
      if (!isIncluded) {
        categoryGames.push({ ..._.cloneDeep(game), includedListings: [] });
      }
    });

    listings.map((listing: ListingQueryData) => {
      const item: ItemQueryData = listing.item;

      if (!item) return null;

      const categoryGameIndex = _.findIndex(
        categoryGames,
        (categoryGame) => categoryGame.id === listing.game.id
      );
      let categoryGame = categoryGames[categoryGameIndex];
      categoryGame &&
        categoryGame.includedListings.push({
          ...listing,
          item,
          listingType: "LISTING",
        });
    });

    return categoryGames;
  }, [getGameByID, listings]);

  const categorizedDataOfReward: any[] | [] = useMemo(() => {
    let categoryGames: any[] = [];
    rewards.map((reward: RewardQueryData) => {
      if (reward.type === "BALANCE") {
        categoryGames.unshift({
          type: "BALANCE",
          balance: reward.balance,
        });

        return null;
      }
      const game = getGameByID(reward.game.id);

      if (!game) return null;

      const isIncluded =
        _.findIndex(
          categoryGames,
          (categoryGame) => categoryGame.id === game.id
        ) !== -1;
      if (!isIncluded) {
        categoryGames.push({
          type: "ITEM",
          ..._.cloneDeep(game),
          includedListings: [],
        });
      }
    });

    rewards.map((reward: RewardQueryData) => {
      if (reward.type === "BALANCE") return null;
      const item: ItemQueryData = reward.item;

      if (!item) return null;

      const categoryGameIndex = _.findIndex(
        categoryGames,
        (categoryGame) => categoryGame.id === reward.game.id
      );
      let categoryGame = categoryGames[categoryGameIndex];
      categoryGame.includedListings.push({
        ...reward,
        item,
        listingType: "REWARD",
      });
    });

    return categoryGames;
  }, [getGameByID, rewards]);

  const handleItemPanelClick = (listing: ExtendedListingQueryData) => () => {
    setSelectedListing(listing);
    isItemEditable
      ? setIsOpenUpdateItemEditor(true)
      : setIsOpenItemViewer(true);
  };

  const handleItemChangesSave = () => {
    setIsOpenUpdateItemEditor(false);
    refresh();
  };

  useEffect(() => {
    getGamesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container {...props} ref={ref}>
        {isShowLabel && listings.length > 0 && (
          <Grid item xs={12} mb={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">
                {isLoading ? (
                  <FullHeightSkeleton width={400} sx={{ mt: 3 }} />
                ) : (
                  listings.length > 0 && listingLabel
                )}
              </Typography>
              {listingOwner && <UserPanel user={listingOwner} />}
            </Stack>
          </Grid>
        )}
        {categorizedDataOfListing.length > 0 && (
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {isLoading ? (
                <Grid item xs={12}>
                  <Stack spacing={2}>
                    <FullHeightSkeleton
                      width={300}
                      height={42}
                      sx={{ borderRadius: 48 }}
                    />
                    <Stack spacing={2} sx={{ ml: "10px !important" }}>
                      {[...Array(2)].map((_, index) => (
                        <FullHeightSkeleton
                          key={index}
                          variant="rounded"
                          width={250}
                          height={30}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              ) : (
                <>
                  {categorizedDataOfListing.map(
                    (categoryGame, index: number) => (
                      <Grid
                        key={categoryGame.id}
                        item
                        {...(!matches && {
                          xs: 12,
                        })}
                        sx={{ display: "flex" }}
                      >
                        <Stack spacing={2}>
                          <SubCategory
                            label={categoryGame.title}
                            isDark={isDark}
                            style={subCategorySx}
                            deleteIcon={
                              <Avatar
                                src={categoryGame.image.url}
                                style={{ width: 24, height: 24 }}
                              />
                            }
                            onDelete={() => {}}
                          />
                          <Stack spacing={2} sx={{ ml: "10px !important" }}>
                            {categoryGame.includedListings.map(
                              (
                                listing: ExtendedListingQueryData,
                                index: number
                              ) => (
                                <ItemPanel
                                  key={index}
                                  label={_.get(listing, "item.name", "")}
                                  isDark={isDark}
                                  avatar={
                                    <Avatar
                                      src={_.get(listing, "item.image.url", "")}
                                      style={{ width: 24, height: 24 }}
                                    />
                                  }
                                  onClick={handleItemPanelClick(listing)}
                                />
                              )
                            )}
                          </Stack>
                        </Stack>
                        {matches &&
                          index < categorizedDataOfListing.length - 1 && (
                            <Stack sx={{ ml: 2 }}>
                              <Typography variant="h5">+</Typography>
                            </Stack>
                          )}
                      </Grid>
                    )
                  )}
                </>
              )}
            </Grid>
          </Grid>
        )}

        <Grid
          item
          xs={12}
          sx={{
            mt: `${isShowLabel && listings.length > 0 ? 30 : 0}px !important`,
          }}
        >
          {isShowLabel && (
            <Typography variant="h6" mb={3}>
              {isLoading ? (
                <FullHeightSkeleton width={400} sx={{ mt: 3 }} />
              ) : (
                rewards.length > 0 && rewardLabel
              )}
            </Typography>
          )}
          <Grid container spacing={3}>
            {isLoading ? (
              <Grid item xs={12}>
                <Stack spacing={2}>
                  <FullHeightSkeleton
                    width={300}
                    height={42}
                    sx={{ borderRadius: 48 }}
                  />
                  <Stack spacing={2} sx={{ ml: "10px !important" }}>
                    {[...Array(2)].map((_, index) => (
                      <FullHeightSkeleton
                        key={index}
                        variant="rounded"
                        width={250}
                        height={30}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Grid>
            ) : (
              <>
                {categorizedDataOfReward.map((categoryGame, index: number) => (
                  <Grid
                    key={index}
                    item
                    {...(!matches && {
                      xs: 12,
                    })}
                    sx={{ display: "flex" }}
                  >
                    <Stack spacing={2}>
                      {categoryGame.type === "BALANCE" ? (
                        <>
                          <SubCategory
                            label="Charsi Balance"
                            isDark={isDark}
                            style={subCategorySx}
                            deleteIcon={
                              <SvgIcon fontSize="medium">
                                <BalanceIcon />
                              </SvgIcon>
                            }
                            onDelete={() => {}}
                          />
                          <Typography
                            variant="h5"
                            color={isDark ? "white" : "green"}
                            fontWeight={600}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <SvgIcon fontSize="medium" sx={{ mr: 1 }}>
                              <BalanceIcon />
                            </SvgIcon>
                            {categoryGame.balance}
                          </Typography>
                        </>
                      ) : categoryGame.type === "ITEM" ? (
                        <>
                          <SubCategory
                            label={categoryGame.title}
                            style={subCategorySx}
                            isDark={isDark}
                            deleteIcon={
                              <Avatar
                                src={categoryGame.image.url}
                                style={{ width: 24, height: 24 }}
                              />
                            }
                            onDelete={() => {}}
                          />
                          <Stack spacing={2} sx={{ ml: "10px !important" }}>
                            {categoryGame.includedListings.map(
                              (
                                reward: ExtendedListingQueryData,
                                index: number
                              ) => (
                                <ItemPanel
                                  key={index}
                                  label={_.get(reward, "item.name", "")}
                                  isDark={isDark}
                                  avatar={
                                    <Avatar
                                      src={_.get(reward, "item.image.url", "")}
                                      style={{ width: 24, height: 24 }}
                                    />
                                  }
                                  onClick={handleItemPanelClick(reward)}
                                />
                              )
                            )}
                          </Stack>
                        </>
                      ) : (
                        <></>
                      )}
                    </Stack>
                    {matches && index < categorizedDataOfReward.length - 1 && (
                      <Stack sx={{ ml: 2 }}>
                        {!isBid ? (
                          <VerticalSeparator label="Or" />
                        ) : (
                          <Typography
                            variant="h4"
                            color={isDark ? "white" : "black"}
                          >
                            +
                          </Typography>
                        )}
                      </Stack>
                    )}
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>

      <UpdateItemEditor
        open={isOpenUpdateItemEditor}
        onClose={() => setIsOpenUpdateItemEditor(false)}
        listing={selectedListing}
        onSave={handleItemChangesSave}
      />
      <ItemViewer
        open={isOpenItemViewer}
        onClose={() => setIsOpenItemViewer(false)}
        listing={selectedListing}
      />
    </>
  );
};

export default ViewerContent;
