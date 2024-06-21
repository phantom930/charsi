import React, { useEffect, useRef, useState } from "react";
import { useReactiveVar } from "@apollo/client";
import { actionDrawerVar } from "@graphql/cache/uiState";

import { useWindowDimensions } from "@/helpers";

export const Main = ({ children }: { children: React.ReactNode }) => {
  const [drawerScroll, setDrawerScroll] = useState<number>(0);
  const { activeModule: actionDrawerOpen } = useReactiveVar(actionDrawerVar);
  const mainRef = useRef<HTMLDivElement>(null);
  const { width: currentWidth } = useWindowDimensions();
  const scrollY = window.scrollY;

  useEffect(() => {
    if (actionDrawerOpen && currentWidth < 720) {
      setDrawerScroll(scrollY);
      if (mainRef.current) {
        mainRef.current.style.position = "fixed";
        mainRef.current.style.top = `${60 - scrollY}px`;
      }
    } else {
      if (mainRef.current) {
        mainRef.current.style.position = "relative";
        mainRef.current.style.top = `0px`;
        window.scroll(0, drawerScroll);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionDrawerOpen]);

  return <main ref={mainRef}>{children}</main>;
};

export default Main;
