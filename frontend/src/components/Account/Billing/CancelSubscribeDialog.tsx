import { useState, useContext, MouseEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";

import RoundButton from "@base/Button/RoundBtn";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import { CharsiContext } from "@providers/CharsiProvider";
import { cancelCharsiPremiumSubscription } from "@store/auth/auth.api";
import type { RootState, AppDispatch } from "@/store";

interface CancelSubscribeDialogProps {
  subscription: object | null;
  open: boolean;
  onClose: (event: MouseEvent) => void;
}

const CancelSubscribeDialog = ({
  subscription,
  open,
  onClose,
}: CancelSubscribeDialogProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const { labels } = useContext(CharsiContext);
  const [isProcessingCancelSubscription, setIsProcessingCancelSubscription] =
    useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  const handleCancelSubscription = () => {
    setIsProcessingCancelSubscription(true);
    dispatch(
      cancelCharsiPremiumSubscription({
        onSuccess: () => {
          enqueueSnackbar(labels.SUCCESS_CANCELLED_SUBSCRIBE_PREMIUM, {
            variant: "success",
          });
          setIsProcessingCancelSubscription(false);
          onClose(null);
        },
        onFail: (error) => {
          enqueueSnackbar(error.message, { variant: "error" });
          setIsProcessingCancelSubscription(false);
        },
      })
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>
        Cancel Subscription
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ pt: 5 }}>
          <Stack direction="column" alignItems="center" spacing={3}>
            <Typography variant="h5" color="black">
              Cancel subscription?
            </Typography>
            <Typography variant="body1" color="grey">
              Your current subscription ends on{" "}
              {auth.premium && subscription !== null && (
                <b>
                  {format(
                    new Date((subscription as any).current_period_end * 1000),
                    "MMM. dd, yyyy"
                  )}
                  .
                </b>
              )}
              <br />
              You can always rejoin again whenever you wish.
            </Typography>
            <Stack direction="row" spacing={2} mt={4}>
              <RoundButton
                variant="outlined"
                color="secondary"
                onClick={() => onClose(null)}
                sx={{
                  width: "fit-content",
                  fontWeight: 400,
                  borderColor: "#fff",
                }}
              >
                Cancel
              </RoundButton>
              <RoundButton
                variant="contained"
                color="primary"
                onClick={handleCancelSubscription}
                disabled={isProcessingCancelSubscription}
                sx={{ width: "fit-content", fontWeight: 400 }}
              >
                {isProcessingCancelSubscription && (
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                )}
                Cancel Subscription
                <Image
                  src="/icons/icon_logo.svg"
                  width={22}
                  height={26}
                  alt="logo"
                  style={{ marginLeft: 5 }}
                />
              </RoundButton>
            </Stack>
          </Stack>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscribeDialog;
