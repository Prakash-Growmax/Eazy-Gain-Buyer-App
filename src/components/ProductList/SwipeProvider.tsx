"use client";
import React, { TransitionStartFunction, useState, useTransition } from "react";

export const SwipeContext = React.createContext<{
  currentId: string;
  handleChangeCurrentId: (newId: string) => void;
  navigating: boolean;
  setNavigating: TransitionStartFunction;
}>({
  currentId: "",
  handleChangeCurrentId: (newId: string) => {
    console.log(newId);
  },
  navigating: false,
  setNavigating: () => {},
});

export default function SwipeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentId, setCurrentId] = useState("");
  const [navigating, setNavigating] = useTransition();
  const handleChangeCurrentId = (newId: string) => {
    setCurrentId(newId);
  };

  return (
    <SwipeContext.Provider
      value={{ currentId, handleChangeCurrentId, navigating, setNavigating }}
    >
      {children}
    </SwipeContext.Provider>
  );
}
