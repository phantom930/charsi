import Skeleton from "@mui/material/Skeleton";
import styled from "@emotion/styled";

type Props = {
  height?: "md" | "lg";
};

const SkeletonStyles = styled(Skeleton)`
  border-radius: 8px;
`;

const heightMap = {
  md: "120px",
  lg: "150px",
};

export const HorizontalSkeleton = ({ height = "lg" }: Props) => {
  return (
    <SkeletonStyles
      variant="rectangular"
      height={heightMap[height]}
      width="100%"
    />
  );
};
