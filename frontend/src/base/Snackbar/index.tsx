import { FC } from "react";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";

type SnackbarPropsType = {
  DefaultSnackbarProps: SnackbarProps;
  DefaultAlertProps: AlertProps;
  msg: String;
};

const SnackbarComponent: FC<SnackbarPropsType> = ({
  DefaultSnackbarProps,
  DefaultAlertProps,
  msg,
}) => {
  return (
    <Snackbar {...DefaultSnackbarProps}>
      <Alert {...DefaultAlertProps}> {msg} </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
