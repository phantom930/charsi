import React, { Fragment } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import useMediaQuery from "@mui/material/useMediaQuery";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import type { Theme } from "@mui/material/styles";

const FilesDropzone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  isShowHelperText = true,
}) => {
  const breakpointsMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );

  return (
    <Fragment>
      <Box
        sx={{
          border: "1px dashed #BDBDBD",
          width: breakpointsMd ? "600px" : "100%",
          height: "170px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="h6">
            Please drop the selected file here!
          </Typography>
        ) : (
          <>
            <Stack sx={{ display: "flex", alignItems: "center" }}>
              <UploadFileIcon color="info" />
              <Stack direction="row" sx={{ mt: 3 }}>
                <Typography
                  color="primary"
                  sx={{ textDecoration: "underline", fontWeight: 500 }}
                >
                  Click to upload
                </Typography>
                <Typography
                  sx={{ fontWeight: 400, fontSize: "16px", ml: "5px" }}
                >
                  or drag and drop
                </Typography>
              </Stack>
              <Typography
                sx={{
                  color: "#000A",
                  fontWeight: 400,
                  fontSize: "14px",
                  mt: 1,
                }}
              >
                SVG, PNG, JPG or GIF (max. 3MB)
              </Typography>
            </Stack>
          </>
        )}
      </Box>
      {isShowHelperText && (
        <FormHelperText
          sx={{
            mt: 2,
            width: breakpointsMd ? "600px" : "100%",
            textAlign: "center",
          }}
        >
          Must be a .jpg, .gif or .png file smaller than 10MB and at least 400px
          by 400px.
        </FormHelperText>
      )}
    </Fragment>
  );
};

export default FilesDropzone;
