import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import ReactCodeInput from "react-verification-code-input-2";
import { useMutation } from "@apollo/client";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/system/Stack";
import MuiPhoneNumber from "material-ui-phone-number-2";

import RoundBtn from "@base/Button/RoundBtn";
import SnackbarComponent from "@base/Snackbar";
import useUploadFile from "@graphql/useUploadFile";
import { OngoingContext } from "@providers/OngoingProvider";
import {
  GET_PHONE_CODE_MUTATION,
  VERIFY_PHONE_CODE_MUTATION,
  SIGN_UP_MUTATION,
} from "@store/auth/auth.graphql";
import { setAuth } from "@store/auth/auth.slice";
import { urlToFile, fullDiscordAvatarUrl } from "@/helpers";
import { website_name } from "@/config";

export default function AttachPhoneNumber() {
  const { accountData } = useContext(OngoingContext);

  const breakpoints_sm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );
  const breakpoints_md = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );
  const temp_user = JSON.parse(
    typeof localStorage !== "undefined"
      ? (localStorage as any).getItem("temp_user") || "{}"
      : "{}"
  );
  const router = useRouter();

  const [getPhoneCode] = useMutation(GET_PHONE_CODE_MUTATION);
  const [verifyPhoneCode] = useMutation(VERIFY_PHONE_CODE_MUTATION);
  const [createUser] = useMutation(SIGN_UP_MUTATION);

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
  const [checkedPolicy, setCheckedPolicy] = useState<boolean>(false);
  // const [code, setCode] = useState<number>();
  const dispatch = useDispatch();
  const handleUploadFile = useUploadFile();

  useEffect(() => {
    if (!accountData?.games) {
      router.push("/create-account/0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const [sentVerifyCode, setSentVerifyCode] = useState<boolean>(false);
  const onHandleVerifyCode = async (code: string) => {
    if (sentVerifyCode) return;
    setSentVerifyCode(true);
    try {
      const result = await verifyPhoneCode({
        variables: { phoneNumber: phone, code },
      });
      const { success } = result.data?.verifyPhoneCode;
      if (success === true) {
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

  const handleCreateAccount = async () => {
    try {
      let file;
      file = await urlToFile(
        fullDiscordAvatarUrl({
          userId: temp_user.discordId,
          avatarHash: temp_user.avatar,
        }),
        `${temp_user.avatar}.png`,
        "image/png"
      );

      const uploadResponse = await handleUploadFile(file);

      const result = await createUser({
        variables: {
          input: {
            username: temp_user.username,
            email: temp_user.email,
            password: "password",
            phone,
            avatar: (uploadResponse as any).upload.id,
            discordAccessToken: temp_user.discordAccessToken,
            games: accountData.games,
          },
        },
      });

      dispatch(
        setAuth({
          ...result.data.register.user,
          jwt: result.data.register.jwt,
        })
      );
      localStorage.removeItem("temp_user");
      router.push("/");
    } catch (error) {
      console.log(error);
      setOpenSnackbar(true);
      setSnackbarType("error");
      setSnackbarMsg(error.message);
    }
  };

  const handleOnChange = (e: any) => {
    setPhone(e);
  };

  return (
    <>
      <Typography textAlign="center" variant={breakpoints_sm ? "h4" : "h6"}>
        Attach a phone number to your account
      </Typography>

      <Typography px={breakpoints_md ? 20 : 0} gutterBottom>
        Here at {website_name}, a phone number is required to ensure our users
        are authentic unique users; multiple {website_name}
        accounts will result in immediate account closure.
      </Typography>

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

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedPolicy}
              onChange={() => {
                setCheckedPolicy(!checkedPolicy);
              }}
            />
          }
          label={`By creating a ${website_name} account, you must accept our Terms and Conditions and Privacy Policy.`}
        />
      </FormGroup>
      <RoundBtn
        variant="contained"
        size="large"
        fullWidth={!breakpoints_sm}
        disabled={!checkedPhone || !checkedPolicy}
        onClick={handleCreateAccount}
      >
        create my account
      </RoundBtn>
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
    </>
  );
}
