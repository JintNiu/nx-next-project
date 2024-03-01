import React, { useEffect, useState, useMemo, memo } from "react";

import "./index.scss";
import PageHeader from "./PageHeader";

type PropsType = {
  showHeader?: boolean;
  pageTitle?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
};

const PageLayout = ({
  showHeader = false,
  pageTitle,
  backgroundColor = "#fff",
  children,
}: PropsType) => {
  return (
    <div className="page-layout">
      {showHeader && <PageHeader title={pageTitle} />}
      <div className="page-content" style={{ background: backgroundColor }}>
        {children}
      </div>
    </div>
  );
};

export default memo(PageLayout);
