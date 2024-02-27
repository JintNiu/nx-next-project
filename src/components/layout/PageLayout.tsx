import React, { useEffect, useState, useMemo, memo } from "react";

import "./index.scss";
import PageHeader from "./PageHeader";

type PropsType = { showHeader?: boolean; pageTitle?: string; children: React.ReactNode };

const PageLayout = ({ showHeader = false, pageTitle, children }: PropsType) => {
  return (
    <div className="page-layout">
      {showHeader && <PageHeader title={pageTitle} />}
      <div className="page-content">{children}</div>
    </div>
  );
};

export default memo(PageLayout);
