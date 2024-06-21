import React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { RootState } from "@/store";

interface AccountDataProps {
  firstName: string;
  lastName: string;
  onChangeFirstName: Function;
  onChangeLastName: Function;
}

export default function AccountData({
  firstName,
  lastName,
  onChangeFirstName,
  onChangeLastName,
}: AccountDataProps) {
  const auth = useSelector((state: RootState) => state.auth);
  const breakpointsMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );

  const handleChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFirstName(e.target.value);
  };

  const handleChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeLastName(e.target.value);
  };

  return (
    <>
      <Grid
        item
        xs={12}
        md={3}
        display="flex"
        justifyContent={breakpointsMd ? "flex-end" : "flex-start"}
      >
        <Typography variant="h5">Account</Typography>
      </Grid>
      <Grid item xs={12} md={9}>
        <Box>
          <TextField
            label="First name"
            InputLabelProps={{ shrink: true }}
            variant="standard"
            value={firstName}
            onChange={handleChangeFirstName}
          />
          <TextField
            label="Last name"
            sx={{ ml: 3 }}
            InputLabelProps={{ shrink: true }}
            variant="standard"
            value={lastName}
            onChange={handleChangeLastName}
          />
        </Box>
        <Box mt={3}>
          <TextField
            label="Discord ID"
            sx={{ minWidth: "400px" }}
            InputLabelProps={{ shrink: true }}
            variant="standard"
            value={`${auth.username}`}
            disabled
          />
        </Box>
      </Grid>
    </>
  );
}
