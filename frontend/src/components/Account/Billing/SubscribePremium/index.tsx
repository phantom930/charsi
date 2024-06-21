import {
  useState,
  useMemo,
  useEffect,
  useContext,
  useRef,
  MouseEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { enqueueSnackbar } from "notistack";
import _ from "lodash";

import RoundButton from "@base/Button/RoundBtn";
import DiagonalTypography from "@base/Typography/DiagonalTypography";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import AddPaymentMethodsBlock from "@components/Account/Billing/AddPaymentMethods";
import { CharsiContext } from "@providers/CharsiProvider";
import {
  getSubscriptionPrices,
  createCharsiPremiumSubscription,
} from "@store/auth/auth.api";
import { website_name } from "@/config";
import type { AddPaymentMethodsBlockRef } from "@components/Account/Billing/AddPaymentMethods";
import type { RootState, AppDispatch } from "@/store";

interface SubscribePremiumProps {
  open: boolean;
  onSubscribeSuccess: () => void;
  onClose: (event: MouseEvent<Element>) => void;
}

export const StyledCheckIconWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 2,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  width: 20,
  height: 20,
  fontSize: 14,
}));

export const ReversedStyledCheckIconWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 2,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.contrastText,
  color: theme.palette.primary.main,
  width: 28,
  height: 28,
}));

const SubscribePremium = ({
  open,
  onSubscribeSuccess,
  onClose,
}: SubscribePremiumProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [priceID, setPriceID] = useState<string>("");
  const [isProcessingSubscribe, setIsProcessingSubscribe] =
    useState<boolean>(false);
  const { labels } = useContext(CharsiContext);
  const dispatch: AppDispatch = useDispatch();
  const addPaymentMethodsBlockRef = useRef<AddPaymentMethodsBlockRef>(null);

  const handleChangePriceID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceID((event.target as HTMLInputElement).value);
  };

  const handleSubscribePremium = async () => {
    if (
      !(
        addPaymentMethodsBlockRef.current &&
        addPaymentMethodsBlockRef.current.activePayment()
      )
    ) {
      enqueueSnackbar(labels.REQUIRED_CHOOSE_PAYMENT_METHOD, {
        variant: "error",
      });

      return;
    }

    setIsProcessingSubscribe(true);
    dispatch(
      createCharsiPremiumSubscription({
        priceID: priceID,
        paymentID: addPaymentMethodsBlockRef.current.activePayment(),
        onSuccess: () => {
          enqueueSnackbar(labels.SUCCESS_SUBSCRIBE_PREMIUM, {
            variant: "success",
          });
          setIsProcessingSubscribe(false);
          onSubscribeSuccess();
        },
        onFail: (error) => {
          enqueueSnackbar(error.message, { variant: "error" });
          setIsProcessingSubscribe(false);
        },
      })
    );
  };

  useEffect(() => {
    dispatch(getSubscriptionPrices());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthlyPlan = useMemo(() => {
    const plan = auth.subscriptionPrices.find(
      (subscriptionPrice) =>
        (subscriptionPrice as any).recurring.interval === "month"
    );
    plan && setPriceID((plan as any).id);
    return plan;
  }, [auth.subscriptionPrices]);

  const yearlyPlan = useMemo(
    () =>
      auth.subscriptionPrices.find(
        (subscriptionPrice) =>
          (subscriptionPrice as any).recurring.interval === "year"
      ),
    [auth.subscriptionPrices]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>
        Subscribe To {website_name} Premium
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ py: 3, pt: 4 }}>
          <Stack direction="column" spacing={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <StyledCheckIconWrapper>
                <CheckIcon fontSize="small" />
              </StyledCheckIconWrapper>
              <Typography variant="body1" color="black">
                Unlimited item listings
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <StyledCheckIconWrapper>
                <CheckIcon fontSize="small" />
              </StyledCheckIconWrapper>
              <Typography variant="body1" color="black">
                Cashout
              </Typography>
              <DiagonalTypography variant="body1" color="rgba(0,0,0,0.5)">
                50%
              </DiagonalTypography>
              <Typography variant="body1" color="black" fontWeight={600}>
                75%
              </Typography>
              <Typography variant="body1" color="black">
                of Charsi Balance back to cash
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <StyledCheckIconWrapper>
                <CheckIcon fontSize="small" />
              </StyledCheckIconWrapper>
              <Typography variant="body1" color="black">
                Ability to style your
              </Typography>
              <Typography
                variant="body1"
                color="primary"
                sx={{ borderBottom: "1px solid", borderBottomColor: "primary" }}
              >
                profile page
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <StyledCheckIconWrapper>
                <CheckIcon fontSize="small" />
              </StyledCheckIconWrapper>
              <Typography variant="body1" color="black">
                Charsi Premium-only Discord features
              </Typography>
            </Stack>
            <AddPaymentMethodsBlock
              ref={addPaymentMethodsBlockRef}
              isShowLabel
              isShowHistoryButton={false}
              mt={3}
            />
            <Stack spacing={1}>
              <Typography variant="body1" color="grey">
                Bill cycle
              </Typography>
              <FormControl>
                <RadioGroup
                  row
                  value={priceID}
                  onChange={handleChangePriceID}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <FormControlLabel
                    value={_.get(monthlyPlan, "id", "")}
                    control={<Radio />}
                    label={`Monthly @ $${
                      monthlyPlan
                        ? Number(
                            Number((monthlyPlan as any).unit_amount) / 100
                          ).toFixed(2)
                        : 0
                    }`}
                  />
                  <FormControlLabel
                    value={_.get(yearlyPlan, "id", "")}
                    control={<Radio />}
                    label={`Yearly @ $${
                      yearlyPlan
                        ? Number(
                            Number((yearlyPlan as any).unit_amount) / 100 / 12
                          ).toFixed(2)
                        : 0
                    }`}
                  />
                  <Typography variant="body1" color="green">
                    (save 16%)
                  </Typography>
                </RadioGroup>
              </FormControl>
            </Stack>

            <Stack spacing={2}>
              <Stack direction="row" alignItems="flex-end">
                <Typography variant="h4" color="black">
                  Billed now:&nbsp;
                </Typography>
                <Typography variant="h4" color="black" fontWeight={600}>
                  $4.95
                </Typography>
                <Typography variant="body1" color="grey">
                  &nbsp;+Tax
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="body1" color="grey">
              Your subscription will automatically renew every year at a rate of
              $4.20 plus any applicable tax, but you can cancel anytime.
            </Typography>
            <Stack alignItems="center" spacing={2}>
              <RoundButton
                variant="contained"
                color="primary"
                onClick={handleSubscribePremium}
                disabled={isProcessingSubscribe}
                sx={{ mt: 3, width: "fit-content", fontWeight: 400 }}
              >
                {isProcessingSubscribe && (
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                )}
                Subscribe to Charsi Premium
                <Image
                  src="/icons/icon_logo.svg"
                  width={22}
                  height={26}
                  alt="logo"
                  style={{ marginLeft: 5 }}
                />
              </RoundButton>
              <Typography variant="body1" color="grey">
                Billed monthly. Cancel any time.
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribePremium;
