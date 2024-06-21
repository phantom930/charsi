import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SvgIcon from "@mui/material/SvgIcon";
import { styled } from "@mui/material/styles";

import BalanceIcon from "@styles/icons/balance.svg";

interface BalanceInputProps {
  label?: string;
  placeholder?: string;
  iconSize?: "small" | "medium" | "large";
  iconPosition?: "start" | "end";
}

type ExtendedBalanceInputProps = BalanceInputProps & TextFieldProps;

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    paddingBottom: "5px",
  },
});

const BalanceInput = ({
  label = "",
  placeholder = "",
  iconSize = "small",
  iconPosition = "end",
  ...props
}: ExtendedBalanceInputProps) => {
  const iconNode = (
    <InputAdornment position={iconPosition}>
      <SvgIcon fontSize={iconSize}>
        <BalanceIcon />
      </SvgIcon>
    </InputAdornment>
  );

  const iconStyle =
    iconPosition === "start"
      ? {
          startAdornment: iconNode,
        }
      : {
          endAdornment: iconNode,
        };

  return (
    <StyledTextField
      label={label}
      type="number"
      variant="standard"
      InputProps={iconStyle}
      InputLabelProps={{ shrink: true }}
      placeholder={placeholder}
      {...props}
    />
  );
};

BalanceInput.displayName = "BalanceInput";
export default BalanceInput;
