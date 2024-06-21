import { makeVar } from "@apollo/client";
//import { ActionDrawerModules } from 'types';

export const fontVar = makeVar<"fontFamily1" | "fontFamily2" | "fontFamily3">(
  "fontFamily1"
);
export const navDrawerVar = makeVar({ open: false });
export const actionDrawerVar = makeVar<{
  activeModule: any;
}>({
  activeModule: null,
});

export const showDevPanelVar = makeVar<boolean>(false);
