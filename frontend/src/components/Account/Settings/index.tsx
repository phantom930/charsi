import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "notistack";
import _ from "lodash";

import AccountData from "./AccountData";
import MyGames from "./MyGames";
import GameAccounts from "./GameAccounts";
import AvatarEditor from "./AvatarEditor";
import FactorAuthentication from "./FactorAuthentication";
import DefaultLayout from "@layouts/DefaultLayout";
import { CharsiContext } from "@providers/CharsiProvider";
import { updateUser } from "@store/auth/auth.api";
import type { RootState, AppDispatch } from "@/store";

export default function Settings() {
  const auth = useSelector((state: RootState) => state.auth);
  const [firstName, setFirstName] = useState<string>(auth.firstname);
  const [lastName, setLastName] = useState<string>(auth.lastname);
  const [avatar, setAvatar] = useState<string>(_.get(auth, "avatar.url", ""));
  const [isInSaveChange, setIsInSaveChange] = useState<boolean>(false);
  const { setIsShowLoadingScreen } = useContext(CharsiContext);
  const myGamesRef = useRef(null);
  const gameAccountsRef = useRef(null);
  const phoneAuthenticationRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch: AppDispatch = useDispatch();

  const handleSaveAccount = async () => {
    try {
      let uploadFileId: null | string = null;
      setIsInSaveChange(true);
      // if (avatarFile) {
      //   const uploadResponse = await handleUploadFile(avatarFile);

      //   uploadFileId = (uploadResponse as any).upload.id;
      // }

      dispatch(
        updateUser({
          where: {
            id: auth.id,
          },
          data: Object.assign(
            {
              firstname: firstName,
              lastname: lastName,
              phone: phoneAuthenticationRef.current.phone,
              games: myGamesRef.current.games,
              gameAccounts: gameAccountsRef.current.gameAccounts,
            },
            uploadFileId
              ? {
                  avatar: uploadFileId,
                }
              : {}
          ),
          onSuccess: () => {
            setIsInSaveChange(false);
            enqueueSnackbar("Changed account settings successfully!", {
              variant: "success",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
            });
          },
        } as any)
      );
    } catch (error) {
      console.log(error);
      setIsInSaveChange(false);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  useEffect(() => {
    setIsShowLoadingScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) setIsShowLoadingScreen(false);
    setFirstName(auth.firstname);
    setLastName(auth.lastname);
    setAvatar(_.get(auth, "avatar.url", ""));
  }, [auth, setIsShowLoadingScreen]);

  return (
    <Grid container spacing={4}>
      <AccountData
        firstName={firstName}
        lastName={lastName}
        onChangeFirstName={setFirstName}
        onChangeLastName={setLastName}
      />
      <MyGames ref={myGamesRef} />
      <GameAccounts ref={gameAccountsRef} />
      <AvatarEditor avatar={avatar} onChangeAvatar={setAvatar} />
      <FactorAuthentication ref={phoneAuthenticationRef} />
      <Grid item xs={3} md={3}></Grid>
      <Grid item xs={9} md={9}>
        <Chip
          label="Save Changes"
          sx={{
            borderRadius: "24px",
            textTransform: "uppercase",
            fontWeight: 500,
            fontSize: "15px",
            px: 1,
            py: 2.5,
          }}
          color="primary"
          onClick={handleSaveAccount}
          disabled={isInSaveChange}
        />
      </Grid>
    </Grid>
  );
}

Settings.getLayout = (page) => (
  <DefaultLayout isAuthenticated={true}>{page}</DefaultLayout>
);
