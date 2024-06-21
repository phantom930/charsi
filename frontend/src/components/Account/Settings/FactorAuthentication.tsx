import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Input, { InputProps } from "@mui/material/Input";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EditIcon from "@mui/icons-material/Edit";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import TwoFA from "@modules/Main/2FA";
import { RootState } from "@/store";
import { devlog, website_name } from "@/config";

type FactorAuthenticationRef = {
  phone: string;
};

const StyledPhoneNumberInput = styled(Input)<InputProps>({
  height: "40px",
});

const FactorAuthentication = forwardRef<FactorAuthenticationRef>(
  (_props, ref) => {
    const auth = useSelector((state: RootState) => state.auth);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>(auth.phone);
    const [newPhone, setNewPhone] = useState<string>("");
    const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
    const breakpointsMd = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("md")
    );

    const handleClickOpen = () => {
      setOpenDialog(true);
    };

    const handleClose = () => {
      setOpenDialog(false);
    };

    const handleVerifySuccess = (phoneNumber: string) => {
      devlog("verify succcess callback: ", phoneNumber);
      phoneNumber && setNewPhone(phoneNumber);
      setIsPhoneVerified(true);
    };

    const handlePhoneSave = () => {
      newPhone && setPhone(newPhone);
      handleClose();
    };

    useEffect(() => {
      setPhone(auth.phone);
    }, [auth.phone]);

    useImperativeHandle(ref, () => ({
      phone: phone,
    }));

    return (
      <>
        <Grid item xs={12} md={3}>
          {breakpointsMd ? (
            <Stack>
              <Typography variant="h5" align="right">
                Two-Factor
              </Typography>
              <Typography variant="h5" align="right">
                Authentication
              </Typography>
            </Stack>
          ) : (
            <Typography variant="h5">Two-Factor Authentication</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={9}>
          <FormControl variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">
              Enter phone number
            </InputLabel>
            <Stack direction="row" sx={{ mt: 2 }}>
              <StyledPhoneNumberInput
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <PhoneAndroidIcon />
                  </InputAdornment>
                }
                value={phone}
                disabled
              />
              <IconButton color="primary" onClick={handleClickOpen}>
                <EditIcon />
              </IconButton>
            </Stack>
          </FormControl>
          <FormHelperText sx={{ mt: 2 }}>
            Here at {website_name}, a phone number is required to ensure our
            users are authentic users. multiple {website_name} accounts will
            result in immediate account closure.
          </FormHelperText>
        </Grid>

        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Enable two-factor authentication (2FA)"}
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">Setup SMS authentication</Typography>
            <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
              Get authentication codes by SMS on your mobile phone when signing
              into {website_name}. Make sure that your country is supported for
              SMS delivery.
            </DialogContentText>
            <Box sx={{ width: "300px", ml: 2, mt: 3 }}>
              <TwoFA onVerifySuccess={handleVerifySuccess} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handlePhoneSave}
              color="secondary"
              variant="contained"
              autoFocus
              disabled={!isPhoneVerified}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

FactorAuthentication.displayName = "FactorAuthentication";

export default FactorAuthentication;
