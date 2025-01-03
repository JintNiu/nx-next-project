import React, { useEffect, useState, useMemo, memo } from "react";

import "./index.scss";
import PageHeader from "./PageHeader";

type PropsType = {
  showHeader?: boolean;
  noPadding?: boolean;
  pageTitle?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  headerOperation?: React.ReactNode;
};

const PageLayout = ({
  showHeader = false,
  pageTitle,
  backgroundColor = "#fff",
  noPadding,
  headerOperation,
  children,
}: PropsType) => {
  return (
    <div className="page-layout">
      {showHeader && <PageHeader title={pageTitle} operation={headerOperation} />}
      <div
        className="page-content"
        style={{
          background: backgroundColor,
          padding: noPadding ? "0" : "10px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default memo(PageLayout);
