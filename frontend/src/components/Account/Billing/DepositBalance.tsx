import { useState, useRef, useContext, MouseEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { enqueueSnackbar } from "notistack";

import RoundButton from "@base/Button/RoundBtn";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import PaymentMethods from "@components/Account/Billing/PaymentMethods";
import { CharsiContext } from "@providers/CharsiProvider";
import type { PaymentMethodsRef } from "@components/Account/Billing/PaymentMethods";

interface DepositBalanceProps {
  amount: string;
  open: boolean;
  onDepositBalance: (id: string) => void;
  onClose: (event: MouseEvent) => void;
}

const DepositBalance = ({
  amount,
  open,
  onDepositBalance,
  onClose,
}: DepositBalanceProps) => {
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);
  const paymentMethodsRef = useRef<PaymentMethodsRef>(null);
  const { labels } = useContext(CharsiContext);

  const handleProcessOrder = () => {
    if (!paymentMethodsRef.current) return;
    if (!paymentMethodsRef.current.activePayment) {
      enqueueSnackbar(labels.REQUIRED_CHOOSE_PAYMENT_METHOD, {
        variant: "error",
      });

      return;
    }
    setIsProcessingOrder(true);
    setTimeout(() => {
      setIsProcessingOrder(false);
    }, 200);
    onClose(null);
    onDepositBalance(paymentMethodsRef.current.activePayment);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>
        Deposit Amount
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ pt: 5 }}>
          <Stack spacing={2}>
            <Typography variant="h5" display="flex" alignItems="center">
              Billing Amount:&nbsp;<b style={{ fontSize: 28 }}>${amount}</b>
            </Typography>
            <Typography variant="h6">Choose payment method</Typography>
            <PaymentMethods ref={paymentMethodsRef} />
          </Stack>
          <Stack direction="row" justifyContent="center" mt={5}>
            <RoundButton
              variant="contained"
              onClick={handleProcessOrder}
              disabled={isProcessingOrder}
              sx={{ width: "fit-content" }}
            >
              {isProcessingOrder && (
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              )}
              Process Order <KeyboardArrowRightIcon />
            </RoundButton>
          </Stack>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default DepositBalance;
