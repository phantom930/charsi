import React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";

interface Props extends TypographyProps {
  label: string;
  separator?: string;
  fontSize?: string;
}

function CustomTypography({
  label,
  separator,
  fontSize,
  variant,
  color,
  sx,
}: Props) {
  const rest = { variant, color, sx };
  return (
    <Typography {...rest} fontSize={fontSize}>
      {label + (separator ? separator : "")}
    </Typography>
  );
}

export default CustomTypography;
