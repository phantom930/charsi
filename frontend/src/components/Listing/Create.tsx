import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
  createRef,
} from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import CancelIcon from "@mui/icons-material/Cancel";
import { EventEmitter } from "events";
import { useSnackbar } from "notistack";
import useArray from "use-array";

import { UppercaseRoundBtn } from "@base/Button/RoundBtn";
import {
  Balance as BalanceIcon,
  StarEffect as StarEffectIcon,
} from "@base/Icon";
import BootstrapDialogTitle from "./BootstrapDialogTitle";
import AddItem from "./AddItem";
import type { AddItemRef, ItemDetails } from "./AddItem";
import AddBalance from "./AddBalance";
import type { AddBalanceRef, BalanceDetails } from "./AddBalance";
import HorizontalSeparator from "@modules/Separator/HorizontalSeparator";
import { useUploadMultipleFile } from "@graphql/useUploadFile";
import type {
  FileUploadResponse,
  UploadMultipleFileResponse,
} from "@graphql/useUploadFile";
import { CharsiContext } from "@providers/CharsiProvider";
import {
  CREATE_LISTING_REWARD_MUTATION,
  CREATE_LISTING_MUTATION,
  CREATE_REWARD_MUTATION,
} from "@store/listing/listing.graphql";
import { InitialAuthState } from "@store/auth/auth.slice";
import { RootState } from "@/store";
import { website_name } from "@/config";

export const emitter: EventEmitter = new EventEmitter();
interface CreateListingDialogProps {
  open: boolean;
  onClose: any;
}

type ListingType = "ITEM" | "BALANCE";
export default function CreateListingDialog({
  open,
  onClose,
}: CreateListingDialogProps) {
  const auth: InitialAuthState = useSelector((state: RootState) => state.auth);
  const { refreshListings, setIsShowLoadingScreen } = useContext(CharsiContext);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isOpenForBids, setIsOpenForBids] = useState<boolean>(true);
  const [isShowHint, setIsShowHint] = useState<boolean>(true);
  const [isStartedAddItem, setIsStartedAddItem] = useState<boolean>(false);
  const [isListingCreatable, setIsListingCreatable] = useState<boolean>(false);
  const [itemEditRefs, { push, empty, removeAt }] = useArray<
    (typeof useRef<AddItemRef>)[] | []
  >([]);
  const [
    rewardItemEditRefs,
    {
      push: pushRewards,
      empty: emptyRewards,
      setAt: setRewardAt,
      removeAt: removeRewardAt,
    },
  ] = useArray<(typeof useRef<AddItemRef | AddBalanceRef>)[] | []>([]);
  const [
    rewardItemEditTypes,
    {
      push: pushRewardTypes,
      empty: emptyRewardTypes,
      setAt: setRewardTypeAt,
      removeAt: removeRewardTypeAt,
    },
  ] = useArray<ListingType[] | []>([]);
  const [createListing] = useMutation(CREATE_LISTING_MUTATION);
  const [createReward] = useMutation(CREATE_REWARD_MUTATION);
  const [createListingReward] = useMutation(CREATE_LISTING_REWARD_MUTATION);
  const handleUploadMultipleFile = useUploadMultipleFile();
  const { enqueueSnackbar } = useSnackbar();

  const addNewItemEditRef = useCallback(() => {
    const newItemEditRef = createRef<AddItemRef>();
    push(newItemEditRef);

    return itemEditRefs[itemEditRefs.length - 1];
  }, [itemEditRefs, push]);

  const addNewRewardItemEditRef = useCallback(() => {
    const newRewardItemEditRef = createRef<AddItemRef>();
    pushRewards(newRewardItemEditRef);

    return rewardItemEditRefs[rewardItemEditRefs.length - 1];
  }, [rewardItemEditRefs, pushRewards]);

  const setNewRewardItemEditRefAt = useCallback(
    (index: number) => {
      const newRewardItemEditRef = createRef<AddItemRef>();
      setRewardAt(index, newRewardItemEditRef);
    },
    [setRewardAt]
  );

  const addNewRewardBalanceEditRef = useCallback(() => {
    const newRewardBalanceEditRef = createRef<AddBalanceRef>();
    pushRewards(newRewardBalanceEditRef);

    return rewardItemEditRefs[rewardItemEditRefs.length - 1];
  }, [rewardItemEditRefs, pushRewards]);

  const setNewRewardBalanceEditRefAt = useCallback(
    (index: number) => {
      const newRewardBalanceEditRef = createRef<AddBalanceRef>();
      setRewardAt(index, newRewardBalanceEditRef);
    },
    [setRewardAt]
  );

  const handleAddItem = () => {
    if (
      itemEditRefs.length &&
      !itemEditRefs[itemEditRefs.length - 1].current?.isItemEditCompleted
    )
      return;

    addNewItemEditRef();
    setIsStartedAddItem(true);
    setIsShowHint(false);
  };

  const handleAddRewardItem =
    (rewardType: ListingType, index: number) => () => {
      // if (
      //   rewardItemEditRefs.length &&
      //   !rewardItemEditRefs[rewardItemEditRefs.length - 1].current
      //     ?.isItemEditCompleted
      // )
      //   return;

      if (index >= rewardItemEditTypes.length) {
        pushRewardTypes(rewardType);
        if (rewardType === "ITEM") addNewRewardItemEditRef();
        else addNewRewardBalanceEditRef();
      } else {
        if (rewardType !== rewardItemEditTypes[index]) {
          setRewardTypeAt(index, rewardType);
          if (rewardType === "ITEM") setNewRewardItemEditRefAt(index);
          else setNewRewardBalanceEditRefAt(index);
        }
      }
    };

  const handleRemoveEditingItem =
    (itemType: "LISTING" | "REWARD", index: number) => () => {
      if (itemType === "LISTING") {
        removeAt(index);
      } else if (itemType === "REWARD") {
        removeRewardAt(index);
        removeRewardTypeAt(index);
      }

      emitter.emit("itemEditCompletedChange");
    };

  const handleSwitchOpenForBids = () => {
    setIsOpenForBids((prev) => !prev);
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setIsOpenForBids(true);
    setIsShowHint(true);
    setIsStartedAddItem(false);
    setIsShowLoadingScreen(false);
    setIsListingCreatable(false);
    // setIsStartedAddRewardItem(false);
    empty();
    emptyRewards();
    emptyRewardTypes();
    emitter.removeAllListeners();
  };

  const handleClose = (
    _event: {},
    _reason: "backdropClick" | "escapeKeyDown"
  ) => {
    // setTitle("");
    // setIsOpenForBids(true);
    // setIsShowHint(true);
    // setIsStartedAddItem(false);
    // setIsStartedAddRewardItem(false);
    // setIsListingCreatable(false);
    // empty();
    // emptyRewards();
    // emptyRewardTypes();
    // emitter.removeAllListeners();
    onClose(_event, _reason);
  };

  const handleCreateListing = async () => {
    try {
      setIsListingCreatable(false);
      setIsShowLoadingScreen(true);

      const allItemDetails: ItemDetails[] = itemEditRefs
        .map((itemEditRef) => itemEditRef.current?.getItemDetail())
        .filter((itemDetail: ItemDetails | null) => itemDetail !== null);

      const listingIDs: string[] = await Promise.all(
        allItemDetails.map(async (itemDetail: ItemDetails) => {
          const { thumbnails, description, values } = itemDetail.itemValues;

          const uploadResponse: UploadMultipleFileResponse =
            await handleUploadMultipleFile(thumbnails);
          const uploadedFileIds: string[] = uploadResponse.multipleUpload?.map(
            (file: FileUploadResponse) => file.id
          );
          const result = await createListing({
            variables: {
              input: {
                type: "ITEM",
                game: itemDetail.game,
                item: itemDetail.item,
                description: description,
                images: uploadedFileIds,
                values: values,
              },
            },
          });

          const newListing = (result as any).data.createListing;

          return newListing.listing.id;
        })
      );

      const rewardItemDetails: (ItemDetails | BalanceDetails)[] =
        rewardItemEditRefs
          .map((rewardItemEditRef) =>
            rewardItemEditRef.current?.getItemDetail()
          )
          .filter(
            (rewardItemDetail: ItemDetails | BalanceDetails | null) =>
              rewardItemDetail !== null
          );

      const rewardIDs: string[] = await Promise.all(
        rewardItemDetails.map(
          async (rewardDetail: ItemDetails | BalanceDetails) => {
            let inputData = {};

            function isItemDetail(obj: any): obj is ItemDetails {
              return "game" in obj && "item" in obj && !("balance" in obj);
            }

            function isBalanceDetail(obj: any): obj is BalanceDetails {
              return !("game" in obj) && !("item" in obj) && "balance" in obj;
            }
            if (isItemDetail(rewardDetail)) {
              inputData = {
                type: "ITEM",
                game: rewardDetail.game,
                item: rewardDetail.item,
                description: rewardDetail.itemValues?.description,
                values: rewardDetail.itemValues?.values,
              };
            } else if (isBalanceDetail(rewardDetail)) {
              inputData = {
                type: "BALANCE",
                balance: rewardDetail.balance,
              };
            }

            const result = await createReward({
              variables: {
                input: inputData,
              },
            });

            const newReward = (result as any).data.createReward;

            return newReward.reward.id;
          }
        )
      );

      await createListingReward({
        mutation: CREATE_LISTING_REWARD_MUTATION,
        variables: {
          input: {
            title,
            description,
            isOpenBids: isOpenForBids,
            listings: [...listingIDs],
            rewards: [...rewardIDs],
            owner: auth.id,
          },
        },
      });

      handleReset();
      onClose();
      enqueueSnackbar("Listing created successfully", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
      refreshListings();
    } catch (error) {
      console.log(error);
      setIsShowLoadingScreen(false);
      setIsListingCreatable(true);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  useEffect(() => {
    emitter.on("itemEditCompletedChange", () => {
      if (itemEditRefs.length == 0 || rewardItemEditRefs.length == 0)
        setIsListingCreatable(false);
      else {
        setIsListingCreatable(
          Boolean(
            title &&
              description &&
              itemEditRefs[0].current?.isItemEditCompleted &&
              rewardItemEditRefs[0].current?.isItemEditCompleted
          )
        );
      }
    });

    return () => {
      emitter.removeAllListeners();
    };
  }, [description, itemEditRefs, rewardItemEditRefs, title]);

  useEffect(() => {
    emitter.emit("itemEditCompletedChange");
  }, [title, description, itemEditRefs, rewardItemEditRefs]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg">
      <BootstrapDialogTitle onClose={handleClose as any}>
        Create Listing
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container>
            <Grid item xs={12} display="flex" flexDirection="column">
              <TextField
                label="Title of listing"
                InputLabelProps={{ shrink: true }}
                variant="standard"
                sx={{ width: "450px" }}
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Description of listing"
                type="text"
                variant="standard"
                sx={{ marginTop: "24px" }}
                rows={4}
                multiline
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Stack sx={{ mt: 3 }} direction="row" spacing={3}>
                <UppercaseRoundBtn
                  color="disabled"
                  variant="contained"
                  size="medium"
                  endIcon={<AddIcon />}
                  onClick={handleAddItem}
                >
                  Add Item
                </UppercaseRoundBtn>
                <UppercaseRoundBtn
                  color="disabled"
                  variant="contained"
                  size="medium"
                  endIcon={<BalanceIcon size={25} />}
                >
                  Add
                </UppercaseRoundBtn>
                <Badge
                  badgeContent={
                    <InfoIcon sx={{ color: "rgba(0, 0, 0, 0.56)", ml: 2 }} />
                  }
                >
                  <UppercaseRoundBtn
                    color={isOpenForBids ? "success" : "error"}
                    variant="contained"
                    size="medium"
                    endIcon={
                      isOpenForBids ? <CheckCircleIcon /> : <CancelIcon />
                    }
                    onClick={handleSwitchOpenForBids}
                  >
                    Open For Bids
                  </UppercaseRoundBtn>
                </Badge>
                <UppercaseRoundBtn
                  variant="contained"
                  size="medium"
                  endIcon={<StarEffectIcon size="medium" />}
                  sx={{
                    background:
                      "#DDD !important",
                  }}
                >
                  Create items from screenshots
                </UppercaseRoundBtn>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Collapse in={isStartedAddItem}>
                <Grid container>
                  {itemEditRefs.map((itemEditRef, index) => (
                    <Grid key={index} item xs={6}>
                      <AddItem
                        ref={itemEditRef}
                        index={index + 1}
                        emitter={emitter}
                        onRemove={handleRemoveEditingItem("LISTING", index)}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Grid item xs={12} sx={{ mt: 15 }}>
                  <Typography variant="h5" sx={{ fontWeight: 400 }}>
                    What would you like in return?
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Stack sx={{ mt: 3 }} spacing={3} direction="row">
                    <UppercaseRoundBtn
                      color="disabled"
                      variant="contained"
                      size="medium"
                      endIcon={<AddIcon />}
                      onClick={handleAddRewardItem("ITEM", 0)}
                    >
                      Add Item
                    </UppercaseRoundBtn>
                    <UppercaseRoundBtn
                      color="disabled"
                      variant="contained"
                      size="medium"
                      endIcon={<BalanceIcon size={25} />}
                      onClick={handleAddRewardItem("BALANCE", 0)}
                      disabled={rewardItemEditTypes.includes("BALANCE")}
                    >
                      Add
                    </UppercaseRoundBtn>
                  </Stack>
                </Grid>
              </Collapse>
            </Grid>
            {rewardItemEditRefs.map((rewardItemEditRef, index) => (
              <Collapse key={index} in={rewardItemEditRef != null}>
                {rewardItemEditTypes[index] === "ITEM" ? (
                  <AddItem
                    ref={rewardItemEditRef}
                    isRewardItem={true}
                    emitter={emitter}
                  />
                ) : (
                  <AddBalance ref={rewardItemEditRef} emitter={emitter} />
                )}
                <Collapse
                  in={
                    rewardItemEditRef.current &&
                    rewardItemEditRef.current.isItemEditCompleted
                  }
                >
                  <HorizontalSeparator
                    label="Or"
                    width={440}
                    labelProps={{ variant: "h4" }}
                    sx={{ my: 5 }}
                  />

                  <Stack sx={{ mt: 3 }} spacing={3} direction="row">
                    <UppercaseRoundBtn
                      color="disabled"
                      variant="contained"
                      size="medium"
                      endIcon={<AddIcon />}
                      onClick={handleAddRewardItem("ITEM", index + 1)}
                    >
                      Add Item
                    </UppercaseRoundBtn>
                    <UppercaseRoundBtn
                      color="disabled"
                      variant="contained"
                      size="medium"
                      endIcon={<BalanceIcon size={25} />}
                      onClick={handleAddRewardItem("BALANCE", index + 1)}
                      disabled={rewardItemEditTypes.includes("BALANCE")}
                    >
                      Add
                    </UppercaseRoundBtn>
                  </Stack>
                </Collapse>
              </Collapse>
            ))}

            {isShowHint && (
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  sx={{ mt: 8, color: "rgba(0, 0, 0, 0.6)", fontWeight: 400 }}
                  align="center"
                >
                  Add items or {website_name} balance to begin
                </Typography>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <UppercaseRoundBtn
                color="primary"
                variant="contained"
                sx={{ width: "320px", mt: 6 }}
                size="large"
                onClick={handleCreateListing}
                disabled={!isListingCreatable}
              >
                Create Listing
              </UppercaseRoundBtn>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
