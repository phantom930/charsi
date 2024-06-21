import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Stack, { StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

import RoundButton from "@base/Button/RoundBtn";
import PaymentMethods from "@components/Account/Billing/PaymentMethods";
import AddPaymentMethodsDialog from "./Dialog";
import { getStripePaymentMethods } from "@store/auth/auth.api";
import type { PaymentMethodsRef } from "@components/Account/Billing/PaymentMethods";
import type { AppDispatch, RootState } from "@/store";

export interface AddPaymentMethodsBlockProps extends StackProps {
  isShowLabel?: boolean;
  isShowHistoryButton?: boolean;
}

export interface AddPaymentMethodsBlockRef {
  activePayment: Function;
}

const AddPaymentMethodsBlock = forwardRef<
  AddPaymentMethodsBlockRef,
  AddPaymentMethodsBlockProps
>(
  (
    { isShowLabel, isShowHistoryButton, ...rest }: AddPaymentMethodsBlockProps,
    ref
  ) => {
    const auth = useSelector((state: RootState) => state.auth);
    const [isOpenAddPaymentMethodsDialog, setIsOpenAddPaymentMethodsDialog] =
      useState<boolean>(false);
    const paymentsRef = useRef<PaymentMethodsRef>(null);
    const dispatch: AppDispatch = useDispatch();

    const handleOpenAddPaymentMethodsDialog = () => {
      setIsOpenAddPaymentMethodsDialog(true);
    };

    const handleSuccessAddPaymentMethod = () => {
      setIsOpenAddPaymentMethodsDialog(false);
      dispatch(getStripePaymentMethods());
    };

    useImperativeHandle(ref, () => ({
      activePayment: () =>
        paymentsRef.current ? paymentsRef.current.activePayment : null,
    }));

    useEffect(() => {
      dispatch(getStripePaymentMethods());
    }, [auth.isAuthenticated, dispatch]);

    return (
      <Stack spacing={3} {...rest}>
        {isShowLabel && (
          <Typography variant="h6">Choose payment method</Typography>
        )}
        <PaymentMethods ref={paymentsRef} />
        <Stack direction="row" spacing={2} alignItems="center">
          <RoundButton
            variant="contained"
            color="secondary"
            onClick={handleOpenAddPaymentMethodsDialog}
          >
            Add New Payment Method
            <AddIcon fontSize="small" sx={{ ml: "5px" }} />
          </RoundButton>
          {isShowHistoryButton && (
            <RoundButton variant="outlined" color="secondary">
              View Balance History
            </RoundButton>
          )}
        </Stack>
        <AddPaymentMethodsDialog
          open={isOpenAddPaymentMethodsDialog}
          onSuccess={handleSuccessAddPaymentMethod}
          onClose={() => setIsOpenAddPaymentMethodsDialog(false)}
        />
      </Stack>
    );
  }
);

AddPaymentMethodsBlock.displayName = "AddPaymentMethodsBlock";

export default AddPaymentMethodsBlock;
