import { Fragment } from "react";
import Box from "@mui/material/Box";
import Stack, { StackProps } from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import _ from "lodash";

import FullHeightSkeleton from "@base/Skeleton";
import StarsRater from "@components/Account/StarsRater";
import type { UserQueryData } from "@store/user/user.slice";

interface UserInfoProps extends StackProps {
  user?: UserQueryData;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  showRate?: boolean;
}

const UserInfo = ({
  user,
  size = "medium",
  isLoading,
  showRate = true,
  ...rest
}: UserInfoProps) => {
  const avatarSize: number =
    size === "small" ? 35 : size === "medium" ? 63 : 90;
  const reviewRate: number = Math.round(_.get(user, "reviewRate", 0));

  return (
    <Stack>
      <Stack
        direction="row"
        spacing={size === "small" ? 1 : 2}
        display="flex"
        alignItems="center"
        {...rest}
      >
        {isLoading ? (
          <Skeleton variant="circular" width={avatarSize} height={avatarSize}>
            <Avatar />
          </Skeleton>
        ) : (
          <Avatar
            src={_.get(user, "avatar.url", "")}
            sx={{ width: avatarSize, height: avatarSize }}
          />
        )}
        <Stack>
          <Box display="flex" alignItems="flex-end">
            {isLoading ? (
              <FullHeightSkeleton width={220} height={40} />
            ) : (
              <Typography
                variant={
                  size === "small" ? "h6" : size === "medium" ? "h5" : "h4"
                }
                fontWeight={size === "small" ? 400 : 500}
              >
                {_.get(user, "username", "")}
              </Typography>
            )}
          </Box>
          {(size === "medium" || size === "large") && (
            <Typography
              display="flex"
              alignItems="center"
              variant={size === "medium" ? "h6" : "h5"}
              fontWeight={400}
            >
              {isLoading ? (
                <FullHeightSkeleton width={150} height={20} sx={{ mt: 1 }} />
              ) : (
                showRate === true && (
                  <Fragment>
                    {user.trades} trades |
                    <StarsRater rating={reviewRate} interactive={false} />
                  </Fragment>
                )
              )}
            </Typography>
          )}
        </Stack>
      </Stack>
      {showRate === true && size === "small" && (
        <Typography display="flex" alignItems="center" variant="h6">
          <StarsRater rating={reviewRate} interactive={false} />
        </Typography>
      )}
    </Stack>
  );
};

export default UserInfo;
