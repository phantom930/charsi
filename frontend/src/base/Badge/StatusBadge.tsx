import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)<BadgeProps>({
  "& .MuiBadge-badge": {
    padding: "0 4px",
    width: 12,
    height: 12,
    minWidth: 12,
  },
});

const StatusBadge = (props: BadgeProps) => {
  return <StyledBadge badgeContent="" {...props} />;
};

export default StatusBadge;
