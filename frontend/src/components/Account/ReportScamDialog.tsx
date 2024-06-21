import { useState, useEffect, useContext, MouseEvent, Fragment } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { enqueueSnackbar } from "notistack";

import HighlightsAutoComplete, { OptionData } from "@base/Autocomplete";
import RoundButton from "@base/Button/RoundBtn";
import UploadedImage from "@base/Image/UploadedImage";
import FilesDropzone from "@base/FilesDropzone";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import { useUploadMultipleFile } from "@graphql/useUploadFile";
import { CharsiContext } from "@providers/CharsiProvider";
import { GET_4_LATEST_USERS_QUERY } from "@store/user/user.graphql";
import { GET_4_LATEST_TRADES_QUERY } from "@store/trade/trade.graphql";
import { createNewScamReport } from "@store/scamReport/scamReport.api";
import type {
  FileUploadResponse,
  UploadMultipleFileResponse,
} from "@graphql/useUploadFile";
import type { UserQueryData } from "@store/user/user.slice";
import type { TradeQueryData } from "@store/trade/trade.slice";
import type { AppDispatch } from "@/store";
import client from "@/graphql";

interface ReportScamProps {
  open: boolean;
  onClose: (event: MouseEvent) => void;
  accusedUser?: UserQueryData;
  trade?: TradeQueryData;
}

const ReportScamDialog = ({
  open,
  onClose,
  accusedUser = null,
  trade = null,
}: ReportScamProps) => {
  const { labels } = useContext(CharsiContext);
  const [userPattern, setUserPattern] = useState<string>("");
  const [latestUsers, setLatestUsers] = useState<OptionData[]>([]);
  const [selectedAccusedUser, setSelectedAccusedUser] =
    useState<OptionData | null>(null);
  const [tradePattern, setTradePattern] = useState<string>("");
  const [latestTrades, setLatestTrades] = useState<OptionData[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<OptionData | null>(null);
  const [reason, setReason] = useState<string>("");
  const [files, setFiles] = useState([]);
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const handleUploadMultipleFile = useUploadMultipleFile();
  const dispatch: AppDispatch = useDispatch();

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

  const onChangeAccusedUser = (_event: any, newOption: OptionData) => {
    setSelectedAccusedUser(newOption);
  };

  const onChangeTrade = (_event: any, newOption: OptionData) => {
    setSelectedTrade(newOption);
  };

  const onSubmitScamReport = async () => {
    if (!selectedAccusedUser) {
      enqueueSnackbar(labels.REQUIRED_SELECT_ACCUSED_USER, {
        variant: "error",
      });
      return;
    }

    if (!selectedTrade) {
      enqueueSnackbar(labels.REQUIRED_SELECT_SCAMMED_TRADE, {
        variant: "error",
      });
      return;
    }

    if (!reason) {
      enqueueSnackbar(labels.REQUIRED_TYPE_SCAM_DESCRIPTION, {
        variant: "error",
      });
      return;
    }

    if (!files.length) {
      enqueueSnackbar(labels.REQUIRED_PROOF_IMAGES_FOR_TRADE, {
        variant: "error",
      });
      return;
    }

    setIsInProgress(true);

    const uploadResponse: UploadMultipleFileResponse =
      await handleUploadMultipleFile(files);
    const uploadedFileIds: string[] = uploadResponse.multipleUpload?.map(
      (file: FileUploadResponse) => file.id
    );

    dispatch(
      createNewScamReport({
        data: {
          accusedUser: selectedAccusedUser.id,
          trade: selectedTrade.id,
          reason: reason,
          proofs: uploadedFileIds,
        },
        onSuccess: () => {
          enqueueSnackbar(labels.SUCCESS_COMPLETED_SCAM_REPORT, {
            variant: "success",
          });
          setIsInProgress(false);
          onClose(null);
        },
        onFail: (error: Error) => {
          enqueueSnackbar(error.message, { variant: "error" });
          setIsInProgress(false);
        },
      })
    );
  };

  useEffect(() => {
    (async () => {
      if (accusedUser) return;
      const { data } = await client.query({
        query: GET_4_LATEST_USERS_QUERY,
        variables: {
          pattern: userPattern,
        },
      });
      const filtered = data.users.map((user: UserQueryData) => ({
        id: user.id,
        title: user.username,
        image: user.avatar.url,
      }));
      setLatestUsers(filtered);
    })();
  }, [userPattern, accusedUser]);

  useEffect(() => {
    (async () => {
      if (trade) return;
      const { data: latestTrades } = await client.query({
        query: GET_4_LATEST_TRADES_QUERY,
        variables: {
          pattern: tradePattern,
        },
      });
      const filteredTrades = latestTrades.trades.map((trade: any) => ({
        id: trade.id,
        title: trade.listing_reward.title,
        optional: {
          trade: trade,
        },
      }));

      setLatestTrades(filteredTrades);
    })();
  }, [tradePattern, trade]);

  useEffect(() => {
    if (!open) {
      setUserPattern("");
      setTradePattern("");
      setReason("");
      setFiles([]);
      setSelectedAccusedUser(null);
      setSelectedTrade(null);
      setIsInProgress(false);
    } else {
      (async () => {
        if (!accusedUser) {
          const { data: latestUsers } = await client.query({
            query: GET_4_LATEST_USERS_QUERY,
          });
          const filtered = latestUsers.users.map((user: UserQueryData) => ({
            id: user.id,
            title: user.username,
            image: user.avatar.url,
          }));
          setLatestUsers(filtered);
        } else {
          const optionData: OptionData = {
            id: accusedUser.id,
            title: accusedUser.username,
            image: accusedUser.avatar.url,
          };
          setLatestUsers([optionData]);
          setSelectedAccusedUser(optionData);
        }

        if (!trade) {
          const { data: latestTrades } = await client.query({
            query: GET_4_LATEST_TRADES_QUERY,
          });
          const filteredTrades = latestTrades.trades.map((trade: any) => ({
            id: trade.id,
            title: trade.listing_reward.title,
            optional: {
              trade: trade,
            },
          }));

          setLatestTrades(filteredTrades);
        } else {
          const optionData: OptionData = {
            id: trade.id,
            title: trade.listing_reward.title,
            optional: {
              trade,
            },
          };
          setLatestTrades([optionData]);
          setSelectedTrade(optionData);
        }
      })();
    }
  }, [accusedUser, open, trade]);

  return (
    <Fragment>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <BootstrapDialogTitle onClose={onClose}>
          Report a Scam
        </BootstrapDialogTitle>
        <DialogContent>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Grid container>
              <Grid item xs={12}>
                <HighlightsAutoComplete
                  label="Accused User"
                  inputValue={userPattern}
                  onInputChange={(_, newInputValue) =>
                    setUserPattern(newInputValue)
                  }
                  options={latestUsers}
                  value={selectedAccusedUser}
                  onChange={onChangeAccusedUser}
                  renderInputStyle={{
                    "& .MuiInputBase-root": {
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#F57C00",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} mt={3} pr={30}>
                <HighlightsAutoComplete
                  label="Select the trade"
                  inputValue={tradePattern}
                  onInputChange={(_, newInputValue) =>
                    setTradePattern(newInputValue)
                  }
                  options={latestTrades}
                  value={selectedTrade}
                  onChange={onChangeTrade}
                  renderInputStyle={{
                    "& .MuiInputBase-root": {
                      fontWeight: 400,
                      fontSize: "16px",
                      color: "rgba(0, 0, 0, 0.87)",
                    },
                  }}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} mt={3} pr={20}>
                <TextField
                  label="How the scam occurred"
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  multiline
                  fullWidth
                  rows={5}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} mt={6}>
                <Stack spacing={3}>
                  <Typography variant="h5">Add screenshots</Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={2} mt={3}>
                    {files.map((file, index: number) => (
                      <UploadedImage
                        key={file.name}
                        src={file.preview}
                        onDelete={handleRemoveImage(index)}
                      />
                    ))}
                  </Stack>
                  <FilesDropzone
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                    isDragActive={isDragActive}
                    isShowHelperText={false}
                  />
                </Stack>
                <RoundButton
                  variant="contained"
                  color="primary"
                  onClick={onSubmitScamReport}
                  disabled={isInProgress}
                  sx={{ mt: 5, mx: "auto", px: 2 }}
                >
                  {isInProgress && (
                    <CircularProgress
                      size={20}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                  )}
                  Submit Report
                </RoundButton>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ReportScamDialog;
