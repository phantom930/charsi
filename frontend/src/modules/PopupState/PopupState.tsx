import { FunctionComponent } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindMenu } from "material-ui-popup-state";
import { ComponentType } from "react";

interface Props {
  Trigger: ComponentType<{ variant: string }>;
  PopupMenu: ComponentType;
}

const PopupMenuBinder: FunctionComponent = (_props: Props) => {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <>
          {/*<Trigger variant='contained' {...bindTrigger(popupState)}>Trigger</Trigger>*/}
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={popupState.close}>Profile</MenuItem>
            <MenuItem onClick={popupState.close}>My account</MenuItem>
            <MenuItem onClick={popupState.close}>Logout</MenuItem>
          </Menu>
        </>
      )}
    </PopupState>
  );
};

export default PopupMenuBinder;
