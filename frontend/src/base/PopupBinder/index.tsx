import Popover from "@mui/material/Popover";
import Fade from "@mui/material/Fade";
import * as React from "react";

interface Props {
  Trigger: React.ComponentType<{
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
  Content: React.ComponentType<{ handleClose: () => void }>;
  popupStyles?: any;
  anchorOrigin?: object;
  transformOrigin?: object;
}

export default function BasicPopover(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const { Trigger, Content, popupStyles, anchorOrigin, transformOrigin } =
    props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Trigger onClick={handleClick} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={
          (anchorOrigin as any) || {
            vertical: "bottom",
            horizontal: "right",
          }
        }
        transformOrigin={
          (transformOrigin as any) || {
            vertical: "top",
            horizontal: "right",
          }
        }
        sx={{ ...popupStyles }}
        TransitionComponent={Fade}
      >
        <Content handleClose={handleClose} />
      </Popover>
    </div>
  );
}
