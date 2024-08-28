
import React, { createContext, useState } from "react";
const TextOptionContext = createContext();

const TextOptionProvider = ({ children }) => {
  const [textHeight,setTextHeight] = useState(2)

  return (
    <TextOptionContext.Provider value={{ textHeight,setTextHeight}}>
      {children}
    </TextOptionContext.Provider>
  );
};

export { TextOptionProvider, TextOptionContext };
