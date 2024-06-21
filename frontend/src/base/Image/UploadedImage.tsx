import { MouseEvent } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";

interface UploadedImageProps {
  src: string;
  onDelete?: (_event: MouseEvent<SVGSVGElement>) => void | undefined;
}

const UploadedImage = ({ src, onDelete = undefined }: UploadedImageProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "65px",
        height: "65px",
      }}
    >
      <Image
        src={src}
        width={65}
        height={65}
        style={{ borderRadius: "8px" }}
        alt="Thumbnail Image"
      />
      {onDelete && (
        <CancelIcon
          component="svg"
          sx={{
            position: "absolute",
            top: "2px",
            right: "2px",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            width: "20px",
            height: "20px",
            "&:hover": { color: "rgba(255,255,255,1)" },
          }}
          onClick={onDelete}
        />
      )}
    </Box>
  );
};

export default UploadedImage;
