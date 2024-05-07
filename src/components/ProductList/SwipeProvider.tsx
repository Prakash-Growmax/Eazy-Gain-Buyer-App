"use client";
import React, { TransitionStartFunction, useState, useTransition } from "react";

export const SwipeContext = React.createContext<{
  currentId: string;
  handleChangeCurrentId: (newId: string) => void;
  navigating: boolean;
  setNavigating: TransitionStartFunction;
  isDataFetching : boolean;
  setIsDataFetching :React.Dispatch<React.SetStateAction<boolean>>; 
}>({
  currentId: "",
  handleChangeCurrentId: (newId: string) => {
  },
  navigating: false,
  setNavigating: () => {},
  isDataFetching : false,
  setIsDataFetching : () => {} 
});

export default function SwipeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentId, setCurrentId] = useState("");
  const [navigating, setNavigating] = useTransition();
  const [isDataFetching, setIsDataFetching] = useState(true)
  const handleChangeCurrentId = (newId: string) => {
    setCurrentId(newId);
  };

  return (
    <SwipeContext.Provider
      value={{ currentId, handleChangeCurrentId, navigating, setNavigating, isDataFetching, setIsDataFetching }}
    >
      {children}
    </SwipeContext.Provider>
  );
}
