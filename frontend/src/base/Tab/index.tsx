import Box from "@mui/material/Box";
import Tab, { TabProps } from "@mui/material/Tab";
import { styled } from "@mui/material/styles";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  panelStyles?: any;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, panelStyles, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, pt: 6, ...panelStyles }}>{children}</Box>
      )}
    </div>
  );
};

export const StyledTab = styled(Tab)<TabProps>({
  textTransform: "uppercase",
  fontFamily: "Roboto",
  fontWeight: 700,
  fontSize: "14px",
  minHeight: "30px !important",
});
