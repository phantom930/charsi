import { useEffect, useState, useContext, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { styled } from "@mui/material/styles";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import _ from "lodash";

import DefaultLayout from "@layouts/DefaultLayout";
import RoundButton from "@base/Button/RoundBtn";
import GradientButton from "@base/Button/GradientButton";
import BalanceInput from "@base/Input/BalanceInput";
import GradientContainer from "@base/Container/GradientContainer";
import DiagonalTypography from "@base/Typography/DiagonalTypography";
import GradientTypography from "@base/Typography/GradientTypography";
import AddPaymentMethodsBlock from "@components/Account/Billing/AddPaymentMethods";
import DepositBalance from "@components/Account/Billing/DepositBalance";
import SubscribePremiumDialog, {
  StyledCheckIconWrapper,
  ReversedStyledCheckIconWrapper,
} from "@components/Account/Billing/SubscribePremium";
import SuccessSubscribeDialog from "@components/Account/Billing/SubscribePremium/SuccessSubscribeDialog";
import CancelSubscribeDialog from "@components/Account/Billing/CancelSubscribeDialog";
import { CharsiContext } from "@providers/CharsiProvider";
import { GET_MY_SUBSCRIPTION_QUERY } from "@store/auth/auth.graphql";
import { depositToBalance } from "@store/auth/auth.api";
import { stripePromise } from "@utility/stripe";
import { website_name } from "@/config";
import client from "@/graphql";
import type { RootState, AppDispatch } from "@/store";

const StyledWhiteHR = styled(Box)({
  width: "100%",
  height: 5,
  backgroundColor: "white",
});
const Billing = () => {
  const { labels, setIsShowLoadingScreen } = useContext(CharsiContext);
  const auth = useSelector((state: RootState) => state.auth);
  const [isOpenDepositBalanceDialog, setIsOpenDepositBalanceDialog] =
    useState<boolean>(false);
  const [isOpenSubscribePremiumDialog, setIsOpenSubscribePremiumDialog] =
    useState<boolean>(false);
  const [isOpenSuccessSubscribeDialog, setIsOpenSuccessSubscribeDialog] =
    useState<boolean>(false);
  const [isOpenCancelSubscribeDialog, setIsOpenCancelSubscribeDialog] =
    useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [isDepositingAmount, setIsDepositingAmount] = useState<boolean>(false);
  const [subscriptionDetail, setSubscriptionDetail] = useState<object>(null);
  const dispatch: AppDispatch = useDispatch();

  const handleOpenDepositBalanceDialog = () => {
    if (Number(depositAmount) <= 0) {
      enqueueSnackbar("Please enter a valid amount", { variant: "error" });
      return;
    }
    setIsOpenDepositBalanceDialog(true);
  };

  const handleDepositCharsiBalance = (paymendID: string) => {
    if (!auth.isAuthenticated) {
      enqueueSnackbar(labels.REQUIRED_LOGIN_TO_DEPOSIT, { variant: "error" });
      return;
    }

    const amount: string = depositAmount;
    setDepositAmount("");

    setIsDepositingAmount(true);
    dispatch(
      depositToBalance({
        amount: Number(amount),
        paymentMethodID: paymendID,
        onSuccess: () => {
          setIsDepositingAmount(false);
          enqueueSnackbar(labels.SUCCESS_DEPOSITED, {
            variant: "success",
          });
        },
        onFail: (error) => {
          setIsDepositingAmount(false);
          enqueueSnackbar(error.message, { variant: "error" });
        },
      })
    );
  };

  const handleSubscribeSuccess = () => {
    setIsOpenSubscribePremiumDialog(false);
    setIsOpenSuccessSubscribeDialog(true);
  };

  useEffect(() => {
    setIsShowLoadingScreen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (auth.isAuthenticated) {
          const { data } = await client.query({
            query: GET_MY_SUBSCRIPTION_QUERY,
          });

          setSubscriptionDetail(_.get(data, "getCustomerSubscription", null));
        }
      } catch (error) {
        console.log("error: ", error);
      }
    })();
  }, [auth.isAuthenticated, dispatch]);

  return (
    <Fragment>
      <Elements
        options={{ appearance: { theme: "stripe" } }}
        stripe={stripePromise}
      >
        <Box overflow="hidden">
          <GradientContainer
            maxWidth={false}
            disableGutters
            sx={{ pb: "5px", transform: "skewY(-2deg) translateY(-40px)" }}
          >
            <Container maxWidth="xl" sx={{ transform: "skewY(2deg)" }}>
              <Grid container pt={10} pb={3}>
                <Grid item xs={12} md={6} display="flex" flexDirection="column">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Image
                      src="/icons/logo_reversed_gradient.svg"
                      width={87}
                      height={87}
                      alt="logo"
                    />
                    <Typography variant="h3" color="white">
                      {website_name} Premium
                    </Typography>
                  </Stack>
                  <Typography variant="h5" color="white" mt={3} fontSize={34}>
                    Current benefits include
                  </Typography>
                  <Stack direction="column" spacing={2} mt={3}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StyledCheckIconWrapper>
                        <CheckIcon fontSize="small" />
                      </StyledCheckIconWrapper>
                      <Typography variant="body1" color="white">
                        Unlimited item listings
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StyledCheckIconWrapper>
                        <CheckIcon fontSize="small" />
                      </StyledCheckIconWrapper>
                      <Typography variant="body1" color="white">
                        Cashout
                      </Typography>
                      <DiagonalTypography
                        variant="body1"
                        color="rgba(0,0,0,0.5)"
                      >
                        50%
                      </DiagonalTypography>
                      <Typography
                        variant="body1"
                        color="white"
                        fontWeight={600}
                      >
                        75%
                      </Typography>
                      <Typography variant="body1" color="white">
                        of Charsi Balance back to cash
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StyledCheckIconWrapper>
                        <CheckIcon fontSize="small" />
                      </StyledCheckIconWrapper>
                      <Typography variant="body1" color="white">
                        Ability to style your
                      </Typography>
                      <Typography
                        variant="body1"
                        color="white"
                        sx={{ borderBottom: "1px solid white" }}
                      >
                        profile page
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StyledCheckIconWrapper>
                        <CheckIcon fontSize="small" />
                      </StyledCheckIconWrapper>
                      <Typography variant="body1" color="white">
                        Charsi Premium-only Discord features
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  display="flex"
                  flexDirection="column"
                  pt={3}
                >
                  {auth.premium && (
                    <Stack
                      direction="row"
                      spacing={1}
                      mb={3}
                      alignItems="center"
                    >
                      <ReversedStyledCheckIconWrapper>
                        <CheckIcon fontSize="small" />
                      </ReversedStyledCheckIconWrapper>
                      <Typography variant="h5" color="white">
                        You're currently a Charsi Premium member.
                      </Typography>
                    </Stack>
                  )}
                  <Typography variant="h4" fontWeight={500} color="white">
                    $4.95/mo
                  </Typography>
                  <Typography variant="body1" color="white">
                    Billed monthly. Cancel any time.
                  </Typography>
                  <Stack direction="row" spacing={2} mt={3}>
                    <Stack alignItems="center" spacing={2}>
                      <RoundButton
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          auth.premium
                            ? setIsOpenCancelSubscribeDialog(true)
                            : setIsOpenSubscribePremiumDialog(true)
                        }
                        sx={{ width: "fit-content", fontWeight: 400 }}
                      >
                        {auth.premium
                          ? "Cancel Subscription"
                          : "Subscribe to Charsi Premium"}
                        <Image
                          src="/icons/icon_logo.svg"
                          width={22}
                          height={26}
                          alt="logo"
                          style={{ marginLeft: 5 }}
                        />
                      </RoundButton>
                      {auth.premium && subscriptionDetail !== null && (
                        <Typography variant="body2" color="white">
                          Next bill date:{" "}
                          {format(
                            new Date(
                              (subscriptionDetail as any).current_period_end *
                                1000
                            ),
                            "MMM. dd, yyyy"
                          )}
                        </Typography>
                      )}
                    </Stack>
                    {auth.premium && (
                      <RoundButton
                        variant="outlined"
                        sx={{
                          width: "fit-content",
                          height: "fit-content",
                          borderColor: "#fff",
                          color: "#fff",
                          fontWeight: 400,
                        }}
                      >
                        View Subscription History
                      </RoundButton>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Container>
            <StyledWhiteHR />
          </GradientContainer>
        </Box>
        <Container maxWidth="xl" sx={{ pt: 3, pb: 10 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} display="flex" flexDirection="column">
              <Stack direction="row" spacing={2} alignItems="center">
                <Image
                  src="/icons/balance.svg"
                  width={78}
                  height={79}
                  alt="balance"
                />
                <Typography variant="h3" fontWeight={500} color="black">
                  {website_name} Balance
                </Typography>
              </Stack>
              <Typography variant="body1" mt={3} color="grey" width={720}>
                {website_name} Balance is the currency you can use within this
                app to trade with your peers. To earn balance, create new
                listings and select “{website_name} Balance” as your desired
                payout. Instead of using
                {website_name} Balance, you can opt to trade your items in any
                game for items in any other game (or the same game).
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              display="flex"
              flexDirection="column"
              sx={{ justifyContent: "flex-end" }}
            >
              <AddPaymentMethodsBlock isShowLabel={false} isShowHistoryButton />
            </Grid>
            <Grid item xs={12} mt={3}>
              <Grid container>
                <Grid item xs={12} md={5}>
                  <Stack direction="column" flex={1} spacing={2}>
                    <Typography variant="h4" fontWeight={500}>
                      Withdraw
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Image
                        src="/icons/dollar.svg"
                        width={52}
                        height={77}
                        alt="dollar"
                      />
                      <ArrowForwardIcon
                        sx={{ fontSize: 58, color: "rgba(0, 0, 0, 0.56)" }}
                      />
                      <Image
                        src="/icons/balance.svg"
                        width={67}
                        height={67}
                        alt="dollar"
                      />
                    </Stack>
                    <Stack
                      direction="column"
                      spacing={1}
                      mt="50px !important"
                      pl={1}
                    >
                      <Typography variant="h5" color="grey" fontWeight={500}>
                        Amount to Deposit
                      </Typography>
                      <TextField
                        label=""
                        type="number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        helperText="Enter the total amount of Charsi Balance you’d like to deposit from your bank"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        sx={{ width: 300 }}
                      />
                      <RoundButton
                        variant="contained"
                        onClick={handleOpenDepositBalanceDialog}
                        disabled={isDepositingAmount}
                        sx={{ mt: "20px !important", width: "fit-content" }}
                      >
                        {isDepositingAmount && (
                          <CircularProgress
                            size={20}
                            color="inherit"
                            sx={{ mr: 1 }}
                          />
                        )}
                        Process Order
                        <KeyboardArrowRightIcon />
                      </RoundButton>
                    </Stack>
                    <Typography variant="body1" color="grey">
                      Note: this purchase is non-refundable.
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Stack direction="column" flex={1} spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="h4" fontWeight={500}>
                        Cashout
                      </Typography>
                      {auth.premium ? (
                        <GradientTypography
                          variant="h6"
                          color="grey"
                          fontWeight={500}
                        >
                          @ 75% rate
                        </GradientTypography>
                      ) : (
                        <Typography variant="h6" color="grey" fontWeight={500}>
                          @ 50% rate
                        </Typography>
                      )}
                    </Stack>
                    {auth.premium ? (
                      <GradientButton
                        variant="outlined"
                        sx={{
                          backgroundImage: "none",
                          width: "fit-content",
                          px: 3,
                        }}
                      >
                        <Image
                          src="/icons/icon_gradient_background_check.svg"
                          width={20}
                          height={20}
                          alt="icon"
                          style={{ marginRight: 5 }}
                        />
                        <GradientTypography
                          variant="body1"
                          textTransform="none"
                        >
                          You’re currently enjoying the highest cash back rate
                          via Charsi Premium
                        </GradientTypography>
                      </GradientButton>
                    ) : (
                      <GradientButton sx={{ width: "fit-content", px: 3 }}>
                        <Image
                          src="/icons/icon_top.svg"
                          width={20}
                          height={20}
                          alt="icon"
                          style={{ marginRight: 5 }}
                        />
                        Upgrade to Charsi Premium to enjoy 75% cash back
                      </GradientButton>
                    )}
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      mt="30px !important"
                    >
                      <Image
                        src="/icons/balance.svg"
                        width={67}
                        height={67}
                        alt="dollar"
                      />
                      <Typography variant="h3" color="green" fontWeight={700}>
                        {auth.balance.toFixed(2)}
                      </Typography>
                      <ArrowForwardIcon
                        sx={{ fontSize: 58, color: "rgba(0, 0, 0, 0.56)" }}
                      />
                      <Image
                        src="/icons/dollar.svg"
                        width={52}
                        height={77}
                        alt="dollar"
                      />
                    </Stack>
                    <Stack
                      direction="column"
                      spacing={1}
                      mt="50px !important"
                      pl={1}
                    >
                      <Typography variant="h5" color="grey" fontWeight={500}>
                        Amount to Withdraw
                      </Typography>
                      <BalanceInput
                        label=""
                        iconSize="large"
                        iconPosition="start"
                        helperText="Enter the total amount of Charsi Balance you’d like to withdraw"
                        sx={{ width: 300, pb: 2 }}
                      />
                      <RoundButton
                        variant="contained"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "fit-content",
                        }}
                      >
                        Process{" "}
                        <b
                          style={{
                            marginLeft: "5px",
                            marginRight: "5px",
                            letterSpacing: "2px",
                          }}
                        >
                          ${(auth.balance / 2).toFixed(2)}
                        </b>{" "}
                        Cashout
                        <KeyboardArrowRightIcon />
                      </RoundButton>
                    </Stack>
                    <Typography variant="body1" color="grey">
                      Note: transfers from Charsi to your bank should take
                      anywhere from 3-5 business days.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mt={10}>
              <Grid container spacing={20}>
                <Grid item xs={12} md={6} display="flex" alignItems="center">
                  <Typography variant="h6" fontWeight={400}>
                    Charsi provides 20+ reliable payment methods for users to
                    buy & trade in-game items and cash-out their trading
                    profits.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Image
                    src="/images/payment_methods.png"
                    width={510}
                    height={385}
                    alt="payment methods"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <DepositBalance
          amount={depositAmount}
          open={isOpenDepositBalanceDialog}
          onDepositBalance={handleDepositCharsiBalance}
          onClose={() => setIsOpenDepositBalanceDialog(false)}
        />
        <SubscribePremiumDialog
          open={isOpenSubscribePremiumDialog}
          onSubscribeSuccess={handleSubscribeSuccess}
          onClose={() => setIsOpenSubscribePremiumDialog(false)}
        />
        <SuccessSubscribeDialog
          open={isOpenSuccessSubscribeDialog}
          onClose={() => setIsOpenSuccessSubscribeDialog(false)}
        />
        <CancelSubscribeDialog
          subscription={subscriptionDetail}
          open={isOpenCancelSubscribeDialog}
          onClose={() => setIsOpenCancelSubscribeDialog(false)}
        />
      </Elements>
    </Fragment>
  );
};

Billing.getLayout = (page) => (
  <DefaultLayout isAuthenticated>{page}</DefaultLayout>
);

export default Billing;
