import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export default function TableSkeleton() {
  return (
    <Box sx={{ display: "block", width: "100%" }}>
      {Array(4)
        .fill(null)
        .map((_u, i) => {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: "20px",
              }}
              key={i}
            >
              <Skeleton
                variant="rectangular"
                width="5%"
                animation="wave"
                height="50px"
                sx={{
                  borderRadius: "10px",
                  display: { xs: "none", md: "block" },
                }}
              />
              <Skeleton
                variant="rectangular"
                width="15%"
                animation="wave"
                height="50px"
                sx={{ borderRadius: "10px" }}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="75%"
                height="50px"
              />
            </Box>
          );
        })}
    </Box>
  );
}
