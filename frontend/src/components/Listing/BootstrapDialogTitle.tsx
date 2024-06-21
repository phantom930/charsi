import React, { MouseEvent } from "react";
import DialogTitle, { DialogTitleProps } from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

interface BootstrapDialogTitleProps extends DialogTitleProps {
  onClose: (event: MouseEvent) => void | any;
}

const StyledDialogTitle = styled(DialogTitle)`
  margin: 0;
  padding: 2;
  height: 40px;
  text-transform: uppercase;
  color: #fff;
  background-color: #7c4dff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function BootstrapDialogTitle(props: BootstrapDialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <StyledDialogTitle {...other} align="center">
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            color: "#fff",
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </StyledDialogTitle>
  );
}
