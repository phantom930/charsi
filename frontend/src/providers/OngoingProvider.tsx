import React, { createContext, FC, ReactNode, useState } from "react";

interface AccountData {
  games: string[];
  phone: number;
}

interface OngoingDataProps {
  accountData: AccountData | undefined;
  setAccountData: React.Dispatch<React.SetStateAction<AccountData | undefined>>;
}

interface OngoingProviderProps {
  children: ReactNode;
}

export const OngoingContext = createContext<OngoingDataProps>({
  accountData: undefined,
  setAccountData: () => undefined,
});

const OngoingProvider: FC<OngoingProviderProps> = ({ children }) => {
  const [accountData, setAccountData] = useState<AccountData | undefined>(
    undefined
  );

  return (
    <OngoingContext.Provider value={{ accountData, setAccountData }}>
      {children}
    </OngoingContext.Provider>
  );
};

export default OngoingProvider;
