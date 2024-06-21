import { useState } from "react";
import ReactCodeInput from "react-verification-code-input-2";
import { useMutation } from "@apollo/client";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/system/Stack";
import MuiPhoneNumber from "material-ui-phone-number-2";

import RoundBtn from "@base/Button/RoundBtn";
import SnackbarComponent from "@base/Snackbar";
import {
  GET_PHONE_CODE_MUTATION,
  VERIFY_PHONE_CODE_MUTATION,
} from "@store/auth/auth.graphql";

interface TwoFactorAuthenticateProps {
  onVerifySuccess: Function;
}

export default function TwoFactorAuthenticate({
  onVerifySuccess,
}: TwoFactorAuthenticateProps) {
  const breakpoints_sm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );

  const [getPhoneCode] = useMutation(GET_PHONE_CODE_MUTATION);
  const [verifyPhoneCode] = useMutation(VERIFY_PHONE_CODE_MUTATION);

  const [phone, setPhone] = useState<string>("");
  const [sentCode, setSentCode] = useState<boolean>(false);
  const [clickedSend, setClickedSend] = useState<boolean>(false);
  const [failedNumber, setFailedNumber] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarType, setSnackbarType] = useState<
    "error" | "info" | "success" | "warning"
  >("info");
  const [snackbarMsg, setSnackbarMsg] = useState<string>("");
  const [checkedPhone, setCheckedPhone] = useState<boolean>(false);
  const [sentVerifyCode, setSentVerifyCode] = useState<boolean>(false);

  const onHandleSendCode = async () => {
    try {
      setClickedSend(true);
      const result = await getPhoneCode({
        variables: { phoneNumber: phone, channel: "sms" },
      });
      const { success, message } = result.data?.getPhoneCode;
      if (success === true) {
        setSentCode(true);
        !failedNumber && setFailedNumber(false);
      } else {
        setOpenSnackbar(true);
        setSnackbarType("error");
        setSnackbarMsg(message);
        setFailedNumber(true);
      }
    } catch (error) {
      console.log(error);
      setOpenSnackbar(true);
      setSnackbarType("error");
      setSnackbarMsg(error.message);
      setFailedNumber(true);
    } finally {
      setClickedSend(false);
    }
  };

  const onHandleVerifyCode = async (code: string) => {
    if (sentVerifyCode) return;
    setSentVerifyCode(true);
    try {
      const result = await verifyPhoneCode({
        variables: { phoneNumber: phone, code },
      });
      const { success } = result.data?.verifyPhoneCode;
      if (success === true) {
        console.log("verify success: ", phone);
        onVerifySuccess(phone);
        setCheckedPhone(true);
        setOpenSnackbar(true);
        setSnackbarType("success");
        setSnackbarMsg("Successfully verified!");
      } else {
        setOpenSnackbar(true);
        setSnackbarType("error");
        setSnackbarMsg("Verification code is invalid!");
      }
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarType("error");
      setSnackbarMsg("Verification code is invalid!");
      console.log(error);
    } finally {
      setSentVerifyCode(false);
    }
  };

  const handleOnChange = (e: any) => {
    setPhone(e);
  };

  return (
    <Stack spacing={5}>
      {!sentCode && (
        <MuiPhoneNumber
          color={failedNumber ? "error" : "primary"}
          defaultCountry={"us"}
          onChange={handleOnChange}
        />
      )}
      {!!sentCode && (
        <ReactCodeInput
          disabled={checkedPhone}
          onComplete={(e) => onHandleVerifyCode(e)}
        />
      )}
      <Stack spacing={2} direction="row">
        {sentCode && !checkedPhone && (
          <RoundBtn
            variant="contained"
            size="large"
            fullWidth={!breakpoints_sm}
            onClick={() => {
              setSentCode(false);
              setPhone("");
            }}
          >
            {" "}
            Change{" "}
          </RoundBtn>
        )}
        {!checkedPhone && (
          <RoundBtn
            variant="contained"
            size="large"
            fullWidth={!breakpoints_sm}
            disabled={phone.length < 12 || clickedSend}
            onClick={() => onHandleSendCode()}
          >
            {" "}
            {!sentCode ? "Send" : "Resend"}{" "}
          </RoundBtn>
        )}
      </Stack>

      <SnackbarComponent
        DefaultSnackbarProps={{
          open: openSnackbar,
          onClose: () => setOpenSnackbar(false),
        }}
        DefaultAlertProps={{
          severity: snackbarType,
          sx: { width: "100%" },
          onClose: () => setOpenSnackbar(false),
        }}
        msg={snackbarMsg}
      />
    </Stack>
  );
}
