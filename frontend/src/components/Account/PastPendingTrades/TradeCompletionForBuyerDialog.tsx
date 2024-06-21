/* eslint-disable @next/next/no-img-element */
import { useState, useContext, MouseEvent, ChangeEvent, Fragment } from "react";
import { useDispatch } from "react-redux";
import Zoom from "react-medium-image-zoom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { enqueueSnackbar } from "notistack";
import "react-medium-image-zoom/dist/styles.css";

import { ConfirmationDialog } from "@base/Alert";
import RoundButton from "@base/Button/RoundBtn";
import GradientTypography from "@base/Typography/GradientTypography";
import FullHeightSkeleton from "@base/Skeleton";
import ReportScamDialog from "@components/Account/ReportScamDialog";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import ViewerContent from "@components/Listing/QuickView/ViewerContent";
import { CharsiContext } from "@providers/CharsiProvider";
import { getCharsiBalance } from "@store/auth/auth.api";
import { markTradeAsCompletedForBuyer } from "@store/trade/trade.api";
import { website_name } from "@/config";
import type { UploadFile } from "@store/listing/listing.slice";
import type { TradeQueryData } from "@store/trade/trade.slice";
import type { AppDispatch } from "@/store";

interface TradeCompletionForBuyerProps {
  open: boolean;
  onClose: (event: MouseEvent) => void;
  trade: TradeQueryData;
}

const TradeCompletionForBuyerDialog = ({
  open,
  onClose,
  trade,
}: TradeCompletionForBuyerProps) => {
  const { labels } = useContext(CharsiContext);
  const [isConfirmationChecked, setIsConfirmationChecked] =
    useState<boolean>(false);
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] =
    useState<boolean>(false);
  const [isOpenReportScamDialog, setIsOpenReportScamDialog] =
    useState<boolean>(false);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const handleCompleteTrade = () => {
    setIsInProgress(true);
    setIsOpenConfirmationDialog(false);

    dispatch(
      markTradeAsCompletedForBuyer({
        id: trade.id,
        onSuccess: () => {
          enqueueSnackbar(labels.SUCCESS_MARKED_TRADE_COMPLETE, {
            variant: "success",
          });

          dispatch(getCharsiBalance());
          setIsInProgress(false);
          onClose(null);
        },
        onFail: (error) => {
          enqueueSnackbar(error.message, { variant: "error" });
          setIsInProgress(false);
        },
      })
    );
  };

  return (
    <Fragment>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <BootstrapDialogTitle onClose={onClose}>
          Trade Completion
        </BootstrapDialogTitle>
        <DialogContent>
          <Container maxWidth="xl" sx={{ py: 5 }}>
            <ViewerContent
              listingLabel="Did you receive"
              listings={trade.listing_reward.listings}
            />
            <Grid container mt={4} spacing={4}>
              <Grid item xs={5}>
                <Typography variant="h6">
                  Seller's proof of completed trade
                </Typography>
                <Typography variant="body2" color="disabled" mt={2} pl={1}>
                  Please review the seller’s screenshots from the trade. If the
                  trade went smoothly and these screenshots accurately reflect
                  the trade, please “Confirm Trade Completion” so that we can
                  award the seller any applicable {website_name} balance.
                  <br />
                  <br />
                  If the seller provided inaccurate screenshot proof, do not
                  move past this step. Instead, report the user and the{" "}
                  {website_name} team will intervene.
                </Typography>
                <Stack spacing={2} mt={3} pl={1}>
                  <RoundButton
                    variant="contained"
                    size="medium"
                    color="secondary"
                    sx={{ textTransform: "uppercase", width: "fit-content" }}
                    onClick={() => setIsOpenReportScamDialog(true)}
                  >
                    Report A Scam
                  </RoundButton>
                </Stack>
              </Grid>
              {trade.isSellerConfirmed ? (
                <Grid item xs={7}>
                  <GradientTypography fontSize={27}>
                    Seller's screenshots
                  </GradientTypography>
                  <Stack mt={3}>
                    <ul /* eslint-disable-line jsx-a11y/no-redundant-roles */
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 2fr 2fr",
                        gridGap: "2rem",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                      }}
                      role="list"
                    >
                      {trade.proofs.map((proof: UploadFile, index: number) => (
                        <li /* eslint-disable-line jsx-a11y/no-redundant-roles */
                          key={index}
                          role="listitem"
                        >
                          <Zoom>
                            <img
                              alt={proof.name}
                              loading="lazy"
                              src={proof.url}
                              style={{
                                objectFit: "cover",
                                objectPosition: "50% 50%",
                                width: "100%",
                              }}
                              width="250"
                              height="auto"
                            />
                          </Zoom>
                        </li>
                      ))}
                    </ul>
                  </Stack>
                </Grid>
              ) : (
                <Grid item xs={7}>
                  <Typography variant="body2" color="disabled" mt={2} pl={1}>
                    Please check back after the seller has completed uploading
                    screenshots from the trade.
                  </Typography>
                  <Stack direction="row" spacing={2} mt={2}>
                    <FullHeightSkeleton width={124} height={120} />
                    <FullHeightSkeleton width={124} height={120} />
                    <FullHeightSkeleton width={124} height={120} />
                  </Stack>
                </Grid>
              )}
            </Grid>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              mt={4}
              px={22}
            >
              <Checkbox
                checked={isConfirmationChecked}
                disableRipple
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setIsConfirmationChecked(event.target.checked)
                }
                sx={{ width: 60, height: 60 }}
              />
              <Typography variant="body1" fontWeight={400}>
                By pressing “Confirm Trade Completion,” you’re pledging that you
                received all of the items included in the seller’s listing.
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              mt={3}
            >
              <RoundButton
                size="large"
                sx={{ textTransform: "uppercase" }}
                onClick={onClose}
              >
                Cancel
              </RoundButton>
              <RoundButton
                variant="contained"
                size="large"
                sx={{ textTransform: "uppercase" }}
                onClick={() => setIsOpenConfirmationDialog(true)}
                disabled={!isConfirmationChecked || isInProgress}
              >
                {isInProgress && (
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                )}
                Confirm Trade Completion
              </RoundButton>
            </Stack>
          </Container>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        open={isOpenConfirmationDialog}
        onClose={() => setIsOpenConfirmationDialog(false)}
        onConfirm={handleCompleteTrade}
        title={labels.COMPLETE_TRADE_CONFIRMATION_TITLE}
        description={
          trade.isSellerConfirmed
            ? labels.COMPLETE_TRADE_CONFIRMATION_MESSAGE
            : labels.WARNING_IGNORE_SELLER_CONFIRMATION
        }
        confirmButtonText="Yes, Complete"
        cancelButtonText="Cancel"
      />
      <ReportScamDialog
        open={isOpenReportScamDialog}
        onClose={() => setIsOpenReportScamDialog(false)}
        accusedUser={trade.listing_reward.owner}
        trade={trade}
      />
    </Fragment>
  );
};

export default TradeCompletionForBuyerDialog;
