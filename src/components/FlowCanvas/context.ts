import { createContext, useContext } from "react";

export const ActionDataContext = createContext({
  editing: false,
  overAddId: null,
});

export const useEditing = () => {
  const dataContext = useContext(ActionDataContext);
  return dataContext.editing;
};

export const useOverAddId = () => {
  const dataContext = useContext(ActionDataContext);
  return dataContext.overAddId;
};
