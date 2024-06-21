import React, { Fragment } from "react";

import { inProduction } from "@/config";

if (typeof window !== "undefined")
  (window as any).devLog = (log: any) => {
    if (!inProduction) {
      console.log(log);
    }
  };

const DevProvider = () => {
  return <Fragment />;
};

export default DevProvider;
