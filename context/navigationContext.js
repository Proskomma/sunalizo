
import React, { createContext } from "react";
import { useState } from "react";
const NavigationContext = createContext();

const NavigationProvider = ({ children }) => {
    const [docSetId,setDocSetId] = useState("xenizo_psle_1")

  return (
    <NavigationContext.Provider value={{ docSetId, setDocSetId }}>
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationContext, NavigationProvider };
