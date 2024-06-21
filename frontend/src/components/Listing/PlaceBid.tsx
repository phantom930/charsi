import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
  createRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import { EventEmitter } from "events";
import { useSnackbar } from "notistack";
import useArray from "use-array";

import { UppercaseRoundBtn } from "@base/Button/RoundBtn";
import { Balance as BalanceIcon } from "@base/Icon";
import BootstrapDialogTitle from "./BootstrapDialogTitle";
import AddItem from "./AddItem";
import type { AddItemRef, ItemDetails } from "./AddItem";
import AddBalance from "./AddBalance";
import type { AddBalanceRef, BalanceDetails } from "./AddBalance";
import HorizontalSeparator from "@modules/Separator/HorizontalSeparator";
//import { placeNewBid } from "@store/listing/listing.api";
import { CharsiContext } from "@providers/CharsiProvider";
import {
  CREATE_REWARD_MUTATION,
  CREATE_BID,
} from "@store/listing/listing.graphql";
import { pushNewBidToListingReward } from "@store/listing/listing.slice";
import type {
  ListingRewardQueryData,
  BidQueryData,
} from "@store/listing/listing.slice";
import type { RootState, AppDispatch } from "@/store";
import { website_name } from "@/config";

export const emitter = new EventEmitter();
interface PlaceBidDialogProps {
  listingReward: ListingRewardQueryData | null;
  open: boolean;
  onClose: any;
}

type ListingType = "ITEM" | "BALANCE";
export default function PlaceBidDialog({
  listingReward,
  open,
  onClose,
}: PlaceBidDialogProps) {
  const auth = useSelector((state: RootState) => state.auth);
  const { labels, setIsShowLoadingScreen } = useContext(CharsiContext);
  const [isShowHint, setIsShowHint] = useState<boolean>(true);
  const [isBidCreatable, setIsBidCreatable] = useState<boolean>(false);
  const [
    bidItemEditRefs,
    { push: pushBids, setAt: setBidAt, empty: emptyBids },
  ] = useArray<(typeof useRef<AddItemRef | AddBalanceRef>)[] | []>([]);
  const [
    bidItemEditTypes,
    { push: pushBidTypes, setAt: setBidTypeAt, empty: emptyBidTypes },
  ] = useArray<ListingType[] | []>([]);
  const [_, setForceUpdate] = useState(false);
  const [createReward] = useMutation(CREATE_REWARD_MUTATION);
  const [createBid] = useMutation(CREATE_BID);
  const dispatch: AppDispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const forceUpdate = () => setForceUpdate((prev) => !prev);

  const addNewBidItemEditRef = useCallback(() => {
    const newBidItemEditRef = createRef<AddItemRef>();
    pushBids(newBidItemEditRef);

    return bidItemEditRefs[bidItemEditRefs.length - 1];
  }, [bidItemEditRefs, pushBids]);

  const setNewBidItemEditRefAt = useCallback(
    (index: number) => {
      const newBidItemEditRef = createRef<AddItemRef>();
      setBidAt(index, newBidItemEditRef);
    },
    [setBidAt]
  );

  const addNewBidBalanceEditRef = useCallback(() => {
    const newBidBalanceEditRef = createRef<AddBalanceRef>();
    pushBids(newBidBalanceEditRef);

    return bidItemEditRefs[bidItemEditRefs.length - 1];
  }, [bidItemEditRefs, pushBids]);

  const setNewBidBalanceEditRefAt = useCallback(
    (index: number) => {
      const newBidBalanceEditRef = createRef<AddBalanceRef>();
      setBidAt(index, newBidBalanceEditRef);
    },
    [setBidAt]
  );

  const handleAddBidItem = (bidType: ListingType, index: number) => () => {
    if (index >= bidItemEditTypes.length) {
      pushBidTypes(bidType);
      if (bidType === "ITEM") addNewBidItemEditRef();
      else addNewBidBalanceEditRef();
    } else {
      if (bidType !== bidItemEditTypes[index]) {
        setBidTypeAt(index, bidType);
        if (bidType === "ITEM") setNewBidItemEditRefAt(index);
        else setNewBidBalanceEditRefAt(index);
      }
    }
    setIsShowHint(false);
  };

  const handleClose = (
    _event: {},
    _reason: "backdropClick" | "escapeKeyDown"
  ) => {
    setIsShowHint(true);
    setIsBidCreatable(false);
    emptyBids();
    emptyBidTypes();
    emitter.removeAllListeners();
    onClose(_event, _reason);
  };

  const handlePlaceBid = async () => {
    try {
      if (!auth.id) return;
      if (!listingReward) return;

      setIsBidCreatable(false);
      setIsShowLoadingScreen(true);

      const bidItemDetails: (ItemDetails | BalanceDetails)[] = bidItemEditRefs
        .map((bidItemEditRef) => bidItemEditRef.current?.getItemDetail())
        .filter(
          (bidItemDetail: ItemDetails | BalanceDetails | null) =>
            bidItemDetail !== null
        );

      const rewardIDs: string[] = await Promise.all(
        bidItemDetails.map(async (bidDetail: ItemDetails | BalanceDetails) => {
          let inputData = {};

          function isItemDetail(obj: any): obj is ItemDetails {
            return "game" in obj && "item" in obj && !("balance" in obj);
          }

          function isBalanceDetail(obj: any): obj is BalanceDetails {
            return !("game" in obj) && !("item" in obj) && "balance" in obj;
          }
          if (isItemDetail(bidDetail)) {
            inputData = {
              type: "ITEM",
              game: bidDetail.game,
              item: bidDetail.item,
              description: bidDetail.itemValues?.description,
              values: bidDetail.itemValues?.values,
            };
          } else if (isBalanceDetail(bidDetail)) {
            inputData = {
              type: "BALANCE",
              balance: bidDetail.balance,
            };
          }

          const result = await createReward({
            variables: {
              input: inputData,
            },
          });

          const newReward = (result as any).data.createReward;

          return newReward.reward.id;
        })
      );

      const { data } = await createBid({
        variables: {
          input: {
            rewards: rewardIDs,
            listing_reward: listingReward.id,
          },
        },
      });

      const newBid: BidQueryData = (data as any).createNewBid.bid;
      dispatch(pushNewBidToListingReward(newBid));

      enqueueSnackbar(labels.SUCCESS_BID_PLACED, {
        variant: "success",
      });

      setIsBidCreatable(true);
      setIsShowLoadingScreen(false);
      onClose();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
      setIsBidCreatable(true);
      setIsShowLoadingScreen(false);
    }
  };

  useEffect(() => {
    emitter.on("itemEditCompletedChange", () => {
      if (bidItemEditRefs.length == 0) setIsBidCreatable(false);
      else {
        setIsBidCreatable(
          Boolean(bidItemEditRefs[0].current?.isItemEditCompleted)
        );
      }
      forceUpdate();
    });

    return () => {
      emitter.removeAllListeners();
    };
  }, [bidItemEditRefs]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <BootstrapDialogTitle onClose={handleClose as any}>
        Place a Bid
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Stack sx={{ mt: 3 }} spacing={3} direction="row">
                  <UppercaseRoundBtn
                    color="disabled"
                    variant="contained"
                    size="medium"
                    endIcon={<AddIcon />}
                    onClick={handleAddBidItem("ITEM", 0)}
                  >
                    Add Item
                  </UppercaseRoundBtn>
                  <UppercaseRoundBtn
                    color="disabled"
                    variant="contained"
                    size="medium"
                    endIcon={<BalanceIcon size={25} />}
                    onClick={handleAddBidItem("BALANCE", 0)}
                    disabled={bidItemEditTypes.includes("BALANCE")}
                  >
                    Add
                  </UppercaseRoundBtn>
                </Stack>
              </Grid>
            </Grid>
            {bidItemEditRefs.map((bidItemEditRef, index) => (
              <Collapse key={index} in={bidItemEditRef != null}>
                {bidItemEditTypes[index] === "ITEM" ? (
                  <AddItem
                    ref={bidItemEditRef}
                    isRewardItem={true}
                    emitter={emitter}
                  />
                ) : (
                  <AddBalance ref={bidItemEditRef} emitter={emitter} />
                )}
                <Collapse
                  in={
                    bidItemEditRef.current &&
                    bidItemEditRef.current.isItemEditCompleted
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
                      onClick={handleAddBidItem("ITEM", index + 1)}
                    >
                      Add Item
                    </UppercaseRoundBtn>
                    <UppercaseRoundBtn
                      color="disabled"
                      variant="contained"
                      size="medium"
                      endIcon={<BalanceIcon size={25} />}
                      onClick={handleAddBidItem("BALANCE", index + 1)}
                      disabled={bidItemEditTypes.includes("BALANCE")}
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
                onClick={handlePlaceBid}
                disabled={!isBidCreatable}
              >
                Place a Bid
              </UppercaseRoundBtn>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
