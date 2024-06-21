import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SnackbarProvider } from "notistack";

export const snackbarVariants = {
  default: {
    style: { backgroundColor: "green" },
    icon: <InfoOutlinedIcon sx={{ mr: "4px" }} />,
    content: (message) => (
      <Alert severity="info" sx={{ padding: "6px 16px" }}>
        {message}
      </Alert>
    ),
  },
  success: {
    style: { backgroundColor: "green" },
    icon: <CheckCircleOutlineIcon sx={{ mr: "4px" }} />,
    content: (message) => (
      <Alert severity="success" sx={{ padding: "6px 16px" }}>
        {message}
      </Alert>
    ),
  },
  info: {
    style: { backgroundColor: "green" },
    icon: <InfoOutlinedIcon sx={{ mr: "4px" }} />,
    content: (message) => (
      <Alert severity="info" sx={{ padding: "6px 16px" }}>
        {message}
      </Alert>
    ),
  },
  warning: {
    style: { backgroundColor: "green" },
    icon: <WarningOutlinedIcon sx={{ mr: "4px" }} />,
    content: (message) => (
      <Alert severity="warning" sx={{ padding: "6px 16px" }}>
        {message}
      </Alert>
    ),
  },
  error: {
    style: { backgroundColor: "green" },
    icon: <ErrorOutlineIcon sx={{ mr: "4px" }} />,
    content: (message) => (
      <Alert severity="error" sx={{ padding: "6px 16px" }}>
        {message}
      </Alert>
    ),
  },
};

export const BootstrapSnackbarMessage = ({ message, variant }) => {
  return (
    <Alert severity={variant} sx={{ padding: "6px 16px" }}>
      {message}
    </Alert>
  );
};

const SnackProvider = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      iconVariant={{
        success: <CheckCircleOutlineIcon sx={{ mr: "4px" }} />,
        error: <ErrorOutlineIcon sx={{ mr: "4px" }} />,
        warning: <WarningOutlinedIcon sx={{ mr: "4px" }} />,
        info: <InfoOutlinedIcon sx={{ mr: "4px" }} />,
        default: <InfoOutlinedIcon sx={{ mr: "4px" }} />,
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackProvider;
