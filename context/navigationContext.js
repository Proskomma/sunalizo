import React, { createContext } from "react";
import { useState } from "react";
const NavigationContext = createContext();

const NavigationProvider = ({ children }) => {
  const [mainDocSetId, setMainDocSetId] = useState("xenizo_psle_1");
  const [secondariesDocSetIds, setSecondariesDocSetIds] = useState(["xenizo_psle_1","xenizo_psle_1"]);

  return (
    <NavigationContext.Provider
      value={{
        docSetId: mainDocSetId,
        setDocSetId: setMainDocSetId,
        setSecondariesDocSetIds: setSecondariesDocSetIds,
        secondariesDocSetIds: secondariesDocSetIds,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationContext, NavigationProvider };
