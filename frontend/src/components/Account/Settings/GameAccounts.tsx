import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  ChangeEventHandler,
} from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import _ from "lodash";

import type { GameAccountsType } from "@store/auth/auth.slice";
import { RootState } from "@/store";

interface AccountTextFieldProps {
  label: string;
  value: string;
  isItemEditable?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

type GameAccountsRef = {
  gameAccounts: GameAccountsType;
};

interface GameAccountsProps {
  gameAccounts?: GameAccountsType;
  isItemEditable?: boolean;
  isShowLabel?: boolean;
  isForAuth?: boolean;
}

const AccountTextField = ({
  label,
  value,
  isItemEditable = true,
  onChange,
}: AccountTextFieldProps) => {
  const [isBlur, setIsBlur] = useState<boolean>(true);
  const [isShowEditButton, setIsShowEditButton] = useState<boolean>(false);
  const breakpointsMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );

  const handleOnBlur = () => {
    if (value !== "") {
      setIsBlur(true);
      setIsShowEditButton(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setIsBlur(true);
      setIsShowEditButton(false);
    }
  };

  const handleEditText = () => {
    setIsBlur(false);
  };

  useEffect(() => {
    setIsShowEditButton(!breakpointsMd);
  }, [breakpointsMd]);

  return (
    <>
      {isBlur ? (
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          onMouseOver={() => {
            setIsShowEditButton(true);
          }}
          onMouseLeave={() => {
            setIsShowEditButton(false);
          }}
        >
          <Typography variant="body2">{`${value}`}</Typography>
          {isItemEditable && (
            <IconButton
              size="small"
              color="primary"
              onClick={handleEditText}
              sx={{ visibility: isShowEditButton ? "visible" : "hidden" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ) : (
        <TextField
          label={label}
          variant="standard"
          size="small"
          InputLabelProps={{ shrink: true }}
          margin="normal"
          sx={{ width: 100 }}
          value={value}
          onChange={onChange}
          onBlur={handleOnBlur}
          onKeyDown={handleKeyDown}
        />
      )}
    </>
  );
};

const GameAccounts = forwardRef<GameAccountsRef, GameAccountsProps>(
  (
    {
      gameAccounts = {},
      isItemEditable = true,
      isShowLabel = true,
      isForAuth = true,
    }: GameAccountsProps,
    ref
  ) => {
    const auth = useSelector((state: RootState) => state.auth);
    const [battleNet, setBattleNet] = useState(
      isForAuth
        ? auth.gameAccounts.battleNet
        : _.get(gameAccounts, "battleNet", "")
    );
    const [nintendo, setNintendo] = useState(
      isForAuth
        ? auth.gameAccounts.nintendo
        : _.get(gameAccounts, "nintendo", "")
    );
    const [playStation, setPlayStation] = useState(
      isForAuth
        ? auth.gameAccounts.playStation
        : _.get(gameAccounts, "playStation", "")
    );
    const [xbox, setXbox] = useState(
      isForAuth ? auth.gameAccounts.xbox : _.get(gameAccounts, "xbox", "")
    );
    const breakpointsMd = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("md")
    );

    useEffect(() => {
      if (!isForAuth) return;
      setBattleNet(auth.gameAccounts.battleNet);
      setNintendo(auth.gameAccounts.nintendo);
      setPlayStation(auth.gameAccounts.playStation);
      setXbox(auth.gameAccounts.xbox);
    }, [
      auth.gameAccounts.battleNet,
      auth.gameAccounts.nintendo,
      auth.gameAccounts.playStation,
      auth.gameAccounts.xbox,
      isForAuth,
    ]);

    useImperativeHandle(ref, () => ({
      gameAccounts: {
        battleNet,
        nintendo,
        playStation,
        xbox,
      },
    }));

    return (
      <>
        {isShowLabel && (
          <Grid item xs={12} md={3}>
            {breakpointsMd ? (
              <Stack>
                <Typography variant="h5" align="right">
                  Gaming
                </Typography>
                <Typography variant="h5" align="right">
                  Accounts
                </Typography>
              </Stack>
            ) : (
              <Typography variant="h5">Gaming Accounts</Typography>
            )}
          </Grid>
        )}
        <Grid item xs={12} md={isShowLabel ? 9 : 12} display="flex">
          <Stack direction={breakpointsMd ? "row" : "column"} spacing={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Image
                src="/icons/discordIcon.svg"
                alt="Discord"
                width={24}
                height={23}
              />
              <Typography
                variant="body2"
                color="disabled"
              >{`${auth.username}`}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Image
                src="/icons/battle.net.svg"
                alt="Icon1"
                width={24}
                height={23}
              />
              <AccountTextField
                label="Battle Net"
                isItemEditable={isItemEditable}
                value={battleNet}
                onChange={(e) => {
                  setBattleNet(e.target.value);
                }}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Image
                src="/icons/nintendo.svg"
                alt="Icon2"
                width={24}
                height={23}
              />
              <AccountTextField
                label="Nintendo"
                isItemEditable={isItemEditable}
                value={nintendo}
                onChange={(e) => {
                  setNintendo(e.target.value);
                }}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Image
                src="/icons/playstation.svg"
                alt="Icon2"
                width={24}
                height={23}
              />
              <AccountTextField
                label="Sony PlayStation"
                isItemEditable={isItemEditable}
                value={playStation}
                onChange={(e) => {
                  setPlayStation(e.target.value);
                }}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Image src="/icons/xbox.svg" alt="Icon2" width={24} height={23} />
              <AccountTextField
                label="Xbox"
                isItemEditable={isItemEditable}
                value={xbox}
                onChange={(e) => {
                  setXbox(e.target.value);
                }}
              />
            </Stack>
          </Stack>
        </Grid>
      </>
    );
  }
);

GameAccounts.displayName = "GameAccounts";
export default GameAccounts;
