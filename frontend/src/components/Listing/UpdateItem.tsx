import { useRef, useState, useContext, MouseEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Container from "@mui/material/Container";
import { useSnackbar } from "notistack";
import _ from "lodash";

import RoundButton from "@base/Button/RoundBtn";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import ItemEditor from "@components/Listing/ItemEditor";
import { useUploadMultipleFile } from "@graphql/useUploadFile";
import { CharsiContext } from "@providers/CharsiProvider";
import type {
  FileUploadResponse,
  UploadMultipleFileResponse,
} from "@graphql/useUploadFile";
import {
  UPDATE_LISTING_MUTATION,
  UPDATE_REWARD_MUTATION,
} from "@store/listing/listing.graphql";
import type { ExtendedListingQueryData } from "@components/Listing/QuickView/ViewerContent";
import type { ItemEditorRef } from "@components/Listing/ItemEditor";
import client from "@/graphql";

interface UpdateItemProps {
  listing: ExtendedListingQueryData | null;
  open: boolean;
  onClose: (event: MouseEvent) => void;
  onSave: () => void;
}

const UpdateItem = ({ listing, open, onClose, onSave }: UpdateItemProps) => {
  const { labels } = useContext(CharsiContext);
  const [isSavingItem, setIsSavingItem] = useState<boolean>(false);
  const itemEditorRef = useRef<ItemEditorRef>(null);
  const handleUploadMultipleFile = useUploadMultipleFile();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveChanges = async () => {
    try {
      if (itemEditorRef.current) {
        setIsSavingItem(true);
        const { values, thumbnails, description } =
          itemEditorRef.current.getItemEditData();
        console.log("values: ", values);
        const thumbnailFiles: File[] = thumbnails.filter(
          (thumbnail: File | string) => typeof thumbnail !== "string"
        );

        const uploadResponse: UploadMultipleFileResponse = thumbnailFiles.length
          ? await handleUploadMultipleFile(thumbnailFiles)
          : { multipleUpload: [] };
        const uploadedFileIDs: string[] = [
          ...thumbnails.filter(
            (thumbnail: File | string) => typeof thumbnail === "string"
          ),
          ...uploadResponse.multipleUpload?.map(
            (file: FileUploadResponse) => file.id
          ),
        ];

        if (listing?.listingType === "LISTING") {
          await client.mutate({
            mutation: UPDATE_LISTING_MUTATION,
            variables: {
              input: {
                where: {
                  id: listing.id,
                },
                data: {
                  description,
                  values,
                  images: uploadedFileIDs,
                },
              },
            },
          });
        } else if (listing?.listingType === "REWARD") {
          await client.mutate({
            mutation: UPDATE_REWARD_MUTATION,
            variables: {
              input: {
                where: {
                  id: listing.id,
                },
                data: {
                  description,
                  values,
                },
              },
            },
          });
        }

        setIsSavingItem(false);
        enqueueSnackbar(labels.SUCCESS_CHANGES_SAVED, { variant: "success" });
        onSave();
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      setIsSavingItem(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>
        {_.get(listing, "item.name", "")}
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ py: 5 }}>
          {listing && (
            <ItemEditor
              ref={itemEditorRef}
              majorCategoryID={listing.item.majorCategory.id}
              listing={listing}
              game={listing.game}
              item={listing.item}
              isItemEditing={true}
              isRewardItem={listing.listingType === "REWARD"}
              onClose={onClose}
            />
          )}
        </Container>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <RoundButton onClick={onClose}>Cancel</RoundButton>
        <RoundButton
          variant="contained"
          color="secondary"
          onClick={handleSaveChanges}
          disabled={isSavingItem}
        >
          Save Changes
        </RoundButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateItem;
