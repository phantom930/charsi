import React, { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import CachedIcon from "@mui/icons-material/Cached";
import path from "path";
import { enqueueSnackbar } from "notistack";
import type { Theme } from "@mui/material/styles";

import RoundButton from "@base/Button/RoundBtn";
import oauth from "@base/Discord";
import useUploadFile from "@graphql/useUploadFile";
import { updateUser } from "@store/auth/auth.api";
import { urlToFile, fullDiscordAvatarUrl } from "@/helpers";
import type { RootState, AppDispatch } from "@/store";

interface AvatarEditorProps {
  avatar: string;
  onChangeAvatar: Function;
}

const RotatingCachedIcon = ({ paused = false }: { paused?: boolean }) => {
  return (
    <CachedIcon
      sx={{
        animation: `${paused ? "none" : "rotation 2s infinite linear"}`,
        "@keyframes rotation": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(-360deg)" },
        },
        ml: 1,
      }}
    />
  );
};

export default function AvatarEditor({ avatar }: AvatarEditorProps) {
  const authState = useSelector((state: RootState) => state.auth);
  const [paused, setPaused] = useState(true);
  const breakpointsMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );
  const dispatch: AppDispatch = useDispatch();
  const handleUploadFile = useUploadFile();

  const handleReimportAvatar = () => {
    if (authState.discordAccessToken) {
      setPaused(false);
      const avatarBaseName = path.basename(
        authState.avatar.url,
        path.extname(authState.avatar.url)
      );

      oauth
        .getUser(authState.discordAccessToken)
        .then(async (user) => {
          let avatarID: null | string = null;

          if (avatarBaseName !== user.avatar) {
            let file;
            file = await urlToFile(
              fullDiscordAvatarUrl({
                userId: user.id,
                avatarHash: user.avatar,
              }),
              `${user.avatar}.png`,
              "image/png"
            );

            const uploadResponse = await handleUploadFile(file);
            avatarID = (uploadResponse as any).upload.id;
          }

          dispatch(
            updateUser({
              where: {
                id: authState.id,
              },
              data: Object.assign(
                {
                  email: user.email,
                  username: user.username,
                },
                avatarID
                  ? {
                      avatar: avatarID,
                    }
                  : {}
              ),
              onSuccess: () => {
                setPaused(true);
                enqueueSnackbar("Reimported from discord successfully!", {
                  variant: "success",
                });
              },
            } as any)
          );
        })
        .catch((_err) => {
          console.log("err");
        });
    } else {
      enqueueSnackbar("You don't have discord access token.", {
        variant: "error",
      });
    }
  };

  return (
    <Fragment>
      <Grid
        item
        xs={12}
        md={3}
        display="flex"
        justifyContent={breakpointsMd ? "flex-end" : "flex-start"}
      >
        <Typography variant="h5">Avatar</Typography>
      </Grid>
      <Grid item xs={12} md={9}>
        <Avatar sx={{ width: "60px", height: "60px", mb: 4 }} src={avatar}>
          OP
        </Avatar>
        <RoundButton
          variant="contained"
          color="primary"
          disabled={!paused}
          onClick={handleReimportAvatar}
        >
          Reimport from Discord
          <RotatingCachedIcon paused={paused} />
        </RoundButton>
      </Grid>
    </Fragment>
  );
}
