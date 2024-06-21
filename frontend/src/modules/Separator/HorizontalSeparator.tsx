import Box from "@mui/material/Box";
import Stack, { StackProps } from "@mui/material/Stack";
import Typography, { TypographyProps } from "@mui/material/Typography";

interface HorizontalSeparatorProps extends StackProps {
  label: string;
  width?: number;
  labelProps?: TypographyProps;
}
const HorizontalSeparator = ({
  label,
  width = 300,
  labelProps = {},
  ...props
}: HorizontalSeparatorProps) => {
  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ ...props.sx, alignItems: "center" }}
    >
      <Box sx={{ width, height: 0, border: "1px solid #E0E0E0" }}></Box>
      <Typography
        variant="body1"
        fontWeight={500}
        textTransform="uppercase"
        {...labelProps}
      >
        {label}
      </Typography>
      <Box sx={{ width, height: 0, border: "1px solid #E0E0E0" }}></Box>
    </Stack>
  );
};

export default HorizontalSeparator;
