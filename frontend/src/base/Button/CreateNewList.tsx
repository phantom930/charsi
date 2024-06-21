import { FunctionComponent, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";

import CreateListing from "@components/Listing/Create";

const DiscordButton = styled(Button)``;

const CreateNewList: FunctionComponent = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (
    _event: {},
    _reason: "backdropClick" | "escapeKeyDown"
  ): void => {
    setOpenDialog(false);
  };

  return (
    <>
      <DiscordButton
        endIcon={<AddIcon />}
        variant="contained"
        sx={{ borderRadius: 50 }}
        onClick={handleOpenDialog}
      >
        Create New Listing
      </DiscordButton>
      <CreateListing open={openDialog} onClose={handleCloseDialog} />
    </>
  );
};

export default CreateNewList;
