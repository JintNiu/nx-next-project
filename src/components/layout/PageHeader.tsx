import React, { useEffect, useState, useMemo, memo } from "react";

import "./index.scss";

type PropsType = {
  title?: string;
  operation?: React.ReactNode;
};

const PageHeader = ({ title, operation }: PropsType) => {
  return (
    <div className="page-header">
      {title && <span className="page-header-title">{title}</span>}
      {operation && <div className="page-header-operation">{operation}</div>}
    </div>
  );
};

export default memo(PageHeader);
