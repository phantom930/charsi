import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import SvgIcon from "@mui/material/SvgIcon";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { EventEmitter } from "events";

import BalanceInput from "@base/Input/BalanceInput";
import { UppercaseRoundBtn } from "@base/Button/RoundBtn";
import BalanceIcon from "@styles/icons/balance.svg";
import { website_name } from "@/config";

const StyledAlert = styled(Alert)({
  display: "flex",
  alignItems: "center",
  fontSize: 20,
  fontWeight: 600,
  backgroundColor: "#E0E0E0",
  "& .MuiIconButton-root": {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    padding: 8,
  },
});

export interface AddBalanceRef {
  isItemEditCompleted: Boolean;
  getItemDetail: Function;
}

export interface AddBalanceProps {
  emitter: EventEmitter;
}
export interface BalanceDetails {
  balance: number;
}

const AddBalance = forwardRef<AddBalanceRef, AddBalanceProps>(
  ({ emitter }, ref) => {
    const [balance, setBalance] = useState<number>(0);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [isShowBalanceAlert, setIsShowBalanceAlert] =
      useState<boolean>(false);

    const handleChangeBalance = (e) => {
      setBalance(e.target.value);
    };

    const handleAddBalance = () => {
      if (!Number(balance)) return;

      const prevBalance = balance;
      setBalance(0);
      setTotalBalance((prevTotal) => Number(prevBalance) + Number(prevTotal));
      setIsShowBalanceAlert(true);
    };

    const handleCloseBalanceAlert = () => {
      setIsShowBalanceAlert(false);
      setBalance(0);
      setTotalBalance(0);
    };

    const handleGetItemDetail: () => BalanceDetails | null = () => {
      if (Number(totalBalance) <= 0) return null;
      return {
        balance: Number(totalBalance),
      };
    };

    useEffect(() => {
      emitter.emit("itemEditCompletedChange", totalBalance);
    }, [totalBalance, emitter]);

    useImperativeHandle(ref, () => ({
      isItemEditCompleted: Number(totalBalance) > 0,
      getItemDetail: handleGetItemDetail,
    }));

    return (
      <Stack spacing={3} sx={{ mt: 5, width: 500 }}>
        <BalanceInput
          label={`Add ${website_name} Balance`}
          color="info"
          iconSize="medium"
          iconPosition="start"
          value={balance}
          onChange={handleChangeBalance}
        />
        <UppercaseRoundBtn
          color="info"
          variant="outlined"
          sx={{ boxShadow: "none !important", width: "fit-content" }}
          endIcon={<AddIcon />}
          onClick={handleAddBalance}
        >
          Add {website_name} Balance
        </UppercaseRoundBtn>
        <Collapse in={isShowBalanceAlert}>
          <StyledAlert
            icon={
              <SvgIcon fontSize="large">
                <BalanceIcon />
              </SvgIcon>
            }
            onClose={handleCloseBalanceAlert}
          >
            {totalBalance}
          </StyledAlert>
        </Collapse>
      </Stack>
    );
  }
);

AddBalance.displayName = "AddBalance";

export default AddBalance;
