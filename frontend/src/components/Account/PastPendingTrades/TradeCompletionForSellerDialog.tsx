import {
  useState,
  useEffect,
  useContext,
  MouseEvent,
  ChangeEvent,
  Fragment,
} from "react";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { enqueueSnackbar } from "notistack";

import { ConfirmationDialog } from "@base/Alert";
import UploadedImage from "@base/Image/UploadedImage";
import FilesDropzone from "@base/FilesDropzone";
import RoundButton from "@base/Button/RoundBtn";
import { StyledCheckIconWrapper } from "@components/Account/Billing/SubscribePremium";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import ViewerContent from "@components/Listing/QuickView/ViewerContent";
import { CharsiContext } from "@providers/CharsiProvider";
import { useUploadMultipleFile } from "@graphql/useUploadFile";
import { markTradeAsCompletedForSeller } from "@store/trade/trade.api";
import { website_name } from "@/config";
import type {
  FileUploadResponse,
  UploadMultipleFileResponse,
} from "@graphql/useUploadFile";
import type {
  ListingQueryData,
  RewardQueryData,
} from "@store/listing/listing.slice";
import type { UserQueryData } from "@store/user/user.slice";
import type { AppDispatch } from "@/store";

interface TradeCompletionForSellerProps {
  open: boolean;
  onClose: (event: MouseEvent) => void;
  tradeID: string;
  listingOwner: UserQueryData;
  listings: ListingQueryData[];
  rewards: RewardQueryData[];
}

const TradeCompletionForSellerDialog = ({
  open,
  onClose,
  tradeID,
  listingOwner,
  listings,
  rewards,
}: TradeCompletionForSellerProps) => {
  const { labels } = useContext(CharsiContext);
  const [files, setFiles] = useState([]);
  const [isConfirmationChecked, setIsConfirmationChecked] =
    useState<boolean>(false);
  const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] =
    useState<boolean>(false);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const handleUploadMultipleFile = useUploadMultipleFile();

  const onDrop = async (acceptedFiles: File[]): Promise<void> => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  };

  const handleRemoveImage = (index: number) => () => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop,
    accept: {
      "image/png": [".svg", ".png", ".jpg", ".gif"],
    },
  });

  const handleConfirmTradeCompletion = () => {
    if (!files.length) {
      enqueueSnackbar(labels.REQUIRED_PROOF_IMAGES_FOR_TRADE, {
        variant: "error",
      });

      return;
    }

    setIsOpenConfirmationDialog(true);
  };

  const handleCompleteTrade = async () => {
    setIsInProgress(true);
    setIsOpenConfirmationDialog(false);

    const uploadResponse: UploadMultipleFileResponse =
      await handleUploadMultipleFile(files);
    const uploadedFileIds: string[] = uploadResponse.multipleUpload?.map(
      (file: FileUploadResponse) => file.id
    );

    dispatch(
      markTradeAsCompletedForSeller({
        id: tradeID,
        proofs: uploadedFileIds,
        onSuccess: () => {
          enqueueSnackbar(labels.SUCCESS_MARKED_TRADE_COMPLETE, {
            variant: "success",
          });
          setIsInProgress(false);
          onClose(null);
        },
        onFail: (error) => {
          enqueueSnackbar(error.message, { variant: "error" });
          setIsInProgress(false);
        },
      })
    );
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <BootstrapDialogTitle onClose={onClose}>
          Trade Completion
        </BootstrapDialogTitle>
        <DialogContent>
          <Container maxWidth="xl" sx={{ py: 5 }}>
            <ViewerContent
              listingOwner={listingOwner}
              listingLabel="Did you give"
              listings={listings}
              rewardLabel="Did you receive"
              rewards={rewards}
            />
            <Grid container mt={4} spacing={2}>
              <Grid item xs={5}>
                <Typography variant="h6">
                  Upload proof of completed trade
                </Typography>
                <Typography variant="body2" color="disabled" mt={2} pl={1}>
                  This step is crucial so that -- in the event of an incomplete
                  trade -- evidence of the trade is logged so that the{" "}
                  {website_name} team can intervene if necessary.
                  <br />
                  <br />
                  Please include the following content in your screenshots (note
                  that each game has a slightly different trade flow):
                </Typography>
                <Stack spacing={2} mt={3} pl={1}>
                  {(() => {
                    const items: string[] = [
                      "Recipient name",
                      "Delivery amount",
                      "Item name(s)",
                      "Server name(s)",
                      "“Trade complete” notification",
                      "System messages that prove delivery completion",
                      "Timestamps",
                    ];

                    return items.map((item: string, index: number) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <StyledCheckIconWrapper>
                          {index + 1}
                        </StyledCheckIconWrapper>
                        <Typography variant="body1" fontWeight={400}>
                          {item}
                        </Typography>
                      </Stack>
                    ));
                  })()}
                </Stack>
              </Grid>
              <Grid item xs={7}>
                <FilesDropzone
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                  isDragActive={isDragActive}
                  isShowHelperText={false}
                />
                <Stack direction="row" flexWrap="wrap" spacing={2} mt={3}>
                  {files.map((file, index: number) => (
                    <UploadedImage
                      key={file.name}
                      src={file.preview}
                      onDelete={handleRemoveImage(index)}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              mt={4}
              px={22}
            >
              <Checkbox
                checked={isConfirmationChecked}
                disableRipple
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setIsConfirmationChecked(event.target.checked)
                }
                sx={{ width: 60, height: 60 }}
              />
              <Typography variant="body1" fontWeight={400}>
                By pressing "Confirm Trade Completion," you're pledging that you
                gave the buyer all of the items included in your listings.&nbsp;
                <b>
                  Wrongful submission will result in immediate account closure.
                </b>
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              mt={3}
            >
              <RoundButton
                size="large"
                sx={{ textTransform: "uppercase" }}
                onClick={onClose}
              >
                Cancel
              </RoundButton>
              <RoundButton
                variant="contained"
                size="large"
                disabled={!isConfirmationChecked || isInProgress}
                onClick={handleConfirmTradeCompletion}
                sx={{ textTransform: "uppercase" }}
              >
                {isInProgress && (
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                )}
                Confirm Trade Completion
              </RoundButton>
            </Stack>
          </Container>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isOpenConfirmationDialog}
        onClose={() => setIsOpenConfirmationDialog(false)}
        onConfirm={handleCompleteTrade}
        title={labels.COMPLETE_TRADE_CONFIRMATION_TITLE}
        description={labels.COMPLETE_TRADE_CONFIRMATION_MESSAGE}
        confirmButtonText="Yes, Complete"
        cancelButtonText="Cancel"
      />
    </Fragment>
  );
};

export default TradeCompletionForSellerDialog;
