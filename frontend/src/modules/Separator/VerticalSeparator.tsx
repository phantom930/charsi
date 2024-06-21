import Box from "@mui/material/Box";
import Stack, { StackProps } from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface VerticalSeparatorProps extends StackProps {
  label: string;
  height?: number;
}
const VerticalSeparator = ({ label, height = 28 }: VerticalSeparatorProps) => {
  return (
    <Stack
      spacing={1}
      sx={{
        display: "flex",
        alignItems: "center",
        transform: "translateY(-25%)",
      }}
    >
      <Box sx={{ width: 0, height, border: "1px solid #E0E0E0" }}></Box>
      <Typography variant="body1" fontWeight={500} textTransform="uppercase">
        {label}
      </Typography>
      <Box sx={{ width: 0, height, border: "1px solid #E0E0E0" }}></Box>
    </Stack>
  );
};

export default VerticalSeparator;
