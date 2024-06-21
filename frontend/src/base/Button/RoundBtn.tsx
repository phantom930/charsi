import Button, { ButtonProps } from "@mui/material/Button";
import styled from "@emotion/styled";

const Rounded = styled(Button)`
  border-radius: 50px !important;
  display: flex;
  align-items: center;
`;

export const UppercaseRoundBtn = styled(Button)`
  border-radius: 64px !important;
  text-transform: uppercase !important;
  font-weight: 500;
  font-size: 15px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
`;

const RoundBtn = (props: ButtonProps) => {
  return <Rounded {...props}>{props.children}</Rounded>;
};

export const WhiteOutlinedRoundButton = (props: ButtonProps) => {
  return (
    <Rounded
      variant="outlined"
      color="disabled"
      {...props}
      sx={{ color: "white", borderColor: "white", width: "fit-content" }}
    >
      {props.children}
    </Rounded>
  );
};

export const BlackOutlinedRoundButton = (props: ButtonProps) => {
  return (
    <Rounded
      variant="outlined"
      color="disabled"
      {...props}
      sx={{ color: "black", borderColor: "black", width: "fit-content" }}
    >
      {props.children}
    </Rounded>
  );
};

export default RoundBtn;
