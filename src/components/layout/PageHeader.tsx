import React, { useEffect, useState, useMemo, memo } from "react";

import "./index.scss";

const PageHeader = ({ title, children }: { title?: string; children?: React.ReactNode }) => {
  return (
    <div className="page-header">
      {title && <span className="page-header-title">{title}</span>}
      {children}
    </div>
  );
};

export default memo(PageHeader);
