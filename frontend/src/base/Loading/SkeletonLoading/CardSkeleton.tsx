import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export default function CardSkeleton() {
  return (
    <Box>
      <Skeleton
        variant="rectangular"
        height="360px"
        width="100%"
        animation="wave"
        sx={{ borderRadius: "10px" }}
      />
      <Skeleton variant="text" animation="wave" height="40px" />
      <Skeleton
        variant="rectangular"
        height="80px"
        width="100%"
        animation="wave"
        sx={{ borderRadius: "10px", marginTop: "15px" }}
      />
    </Box>
  );
}
