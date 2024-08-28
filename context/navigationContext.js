import React, { createContext } from "react";
import { useState } from "react";
const NavigationContext = createContext();

const NavigationProvider = ({ children }) => {
  const [mainDocSetId, setMainDocSetId] = useState("xenizo_psle_1");
  const [secondariesDocSetIds, setSecondariesDocSetIds] = useState([]);
  const [questionDocSetId,setQuestionDocSetId] = useState('')
  const [bookCode,setBookCode] = useState("MRK")
  const [currentChap, setCurrentChap] = useState(1)
  return (
    <NavigationContext.Provider
      value={{
        docSetId: mainDocSetId,
        setDocSetId: setMainDocSetId,
        setSecondariesDocSetIds: setSecondariesDocSetIds,
        secondariesDocSetIds: secondariesDocSetIds,
        questionDocSetId:questionDocSetId,
        setQuestionDocSetId:setQuestionDocSetId,
        bookCode:bookCode,
        setBookCode:setBookCode,
        setCurrentChap:setCurrentChap,
        currentChap:currentChap,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationContext, NavigationProvider };
