import { useMemo, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CommentIcon from "@mui/icons-material/Comment";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/styles";
import { useSnackbar } from "notistack";
import _ from "lodash";

import RoundButton from "@base/Button/RoundBtn";
import { ConfirmationDialog } from "@base/Alert";
import ViewerContent from "@components/Listing/QuickView/ViewerContent";
import AllBidsView from "@components/Listing/AllBidsView";
import { CharsiContext } from "@providers/CharsiProvider";
import {
  UPDATE_LISTING_REWARD_MUTATION,
  DELETE_LISTING_REWARD_MUTATION,
} from "@store/listing/listing.graphql";
import type { ListingRewardQueryData } from "@store/listing/listing.slice";
import type { RootState } from "@/store";
import client from "@/graphql";

interface BidOnItemPanelProps {
  listingRewardID: string;
}

const Panel = styled(Box)({
  width: "100%",
  backgroundColor: "#EEE",
  borderRadius: "8px",
  padding: "30px 20px",
});

const BidOnItemPanel = ({ listingRewardID }: BidOnItemPanelProps) => {
  const { labels } = useContext(CharsiContext);
  const authState = useSelector((state: RootState) => state.auth);
  const listingState = useSelector((state: RootState) => state.listing);
  const [isEditTextMode, setIsEditTextMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSavingText, setIsSavingText] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] =
    useState<boolean>(false);
  const [isOpenAllBidsView, setIsOpenAllBidsView] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const listingReward: ListingRewardQueryData | null = useMemo(
    () =>
      _.find(
        listingState.listingRewards,
        (listingReward: ListingRewardQueryData) =>
          listingReward.id === listingRewardID
      ) || null,
    [listingRewardID, listingState.listingRewards]
  );

  const handleSaveTextChanges = async () => {
    try {
      setIsSavingText(true);
      await client.mutate({
        mutation: UPDATE_LISTING_REWARD_MUTATION,
        variables: {
          input: {
            where: {
              id: listingReward.id,
            },
            data: {
              title,
              description,
            },
          },
        },
      });
      setIsEditTextMode(false);
      setIsSavingText(false);
      enqueueSnackbar(labels.SUCCESS_CHANGES_SAVED, { variant: "success" });
    } catch (error) {
      setIsEditTextMode(false);
      setIsSavingText(false);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handleOpenViewAllBids = () => {
    setIsOpenAllBidsView(true);
  };

  const handleDeleteListingReward = async () => {
    try {
      setIsDeleting(true);
      await client.mutate({
        mutation: DELETE_LISTING_REWARD_MUTATION,
        variables: {
          input: {
            where: {
              id: listingReward.id,
            },
          },
        },
      });
      setIsDeleting(false);
      enqueueSnackbar(labels.SUCCESS_CHANGES_SAVED, { variant: "success" });
    } catch (error) {
      setIsDeleting(false);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  useEffect(() => {
    if (listingReward) {
      setTitle(listingReward.title);
      setDescription(listingReward.description);
    }
  }, [listingReward]);

  return (
    <>
      <Grid item xs={12} md={12} lg={6}>
        <Panel>
          <Stack spacing={4}>
            <Stack spacing={2}>
              {!isEditTextMode ? (
                <Typography variant="h4">{title}</Typography>
              ) : (
                <TextField
                  label="Title"
                  type="text"
                  variant="filled"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              )}
              {!isEditTextMode ? (
                <Typography variant="body1" color="grey">
                  {description}
                </Typography>
              ) : (
                <TextField
                  label="Description"
                  type="text"
                  variant="filled"
                  rows={3}
                  multiline
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              )}
              <RoundButton
                color="primary"
                variant="contained"
                sx={{ width: "fit-content" }}
                onClick={
                  !isEditTextMode
                    ? () => setIsEditTextMode(true)
                    : handleSaveTextChanges
                }
                disabled={isSavingText}
              >
                {!isEditTextMode ? "Edit Text" : "Save Changes"}
              </RoundButton>
            </Stack>

            <Stack spacing={2} mt={5}>
              <Typography variant="h5" fontWeight={600}>
                Edit images and item descriptions
                <InfoIcon sx={{ ml: "4px" }} />
              </Typography>
              <ViewerContent
                listings={_.get(listingReward, "listings", [])}
                rewards={_.get(listingReward, "rewards", [])}
                isItemEditable={true}
                subCategorySx={{ backgroundColor: "#616161" }}
              />
            </Stack>

            <Grid container spacing={2} ml="-16px !important">
              <Grid item xs={12} md={6}>
                <RoundButton
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleOpenViewAllBids}
                >
                  <ContentCopyIcon sx={{ marginRight: "5px" }} />{" "}
                  {_.get(listingReward, "bids.length", 0)} bids
                </RoundButton>
              </Grid>
              <Grid item xs={12} md={6}>
                <RoundButton
                  variant="outlined"
                  color="secondary"
                  size="large"
                  fullWidth
                >
                  <CommentIcon sx={{ marginRight: "5px" }} /> 2 comments
                </RoundButton>
              </Grid>
              <Grid item xs={12}>
                <RoundButton
                  LinkComponent={Link}
                  href={`/listing/${_.get(listingReward, "id", "")}`}
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "uppercase" }}
                  fullWidth
                >
                  View Listing
                </RoundButton>
              </Grid>
              <Grid item xs={12}>
                <RoundButton
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: "uppercase" }}
                  fullWidth
                  onClick={() => setIsOpenConfirmationDialog(true)}
                  disabled={isDeleting}
                >
                  Delete Listing
                </RoundButton>
              </Grid>
            </Grid>
          </Stack>
        </Panel>
      </Grid>

      <ConfirmationDialog
        open={isOpenConfirmationDialog}
        onClose={() => setIsOpenConfirmationDialog(false)}
        onConfirm={handleDeleteListingReward}
        title={labels.DELETE_LISTING_CONFIRMATION_TITLE}
        description={labels.DELETE_LISTING_CONFIRMATION_MESSAGE}
        confirmButtonText="Yes, Delete"
        cancelButtonText="Cancel"
      />
      <AllBidsView
        listingRewardID={_.get(listingReward, "id", "")}
        bids={_.get(listingReward, "bids", [])}
        isOwner={_.get(listingReward, "owner.id", "owner_id") === authState.id}
        open={isOpenAllBidsView}
        onClose={() => setIsOpenAllBidsView(false)}
      />
    </>
  );
};

export default BidOnItemPanel;
