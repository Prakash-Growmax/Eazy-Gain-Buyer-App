"use client";
import React, { ReactNode, useState } from "react";

interface ContextProps {
  BrandList: any[]; // Adjust this type according to your data
  setBrandList: React.Dispatch<React.SetStateAction<any[]>>;
  CategoryList: any[]; // Adjust this type according to your data
  setCategoryList: React.Dispatch<React.SetStateAction<any[]>>;
  isDataFetching:boolean;
  setIsDataFetching :  React.Dispatch<React.SetStateAction<boolean>>;
}

export const PublicPageContext = React.createContext<ContextProps>({
  BrandList: [],
  setBrandList: () => {},
  CategoryList: [],
  setCategoryList: () => {},
  isDataFetching : true,
  setIsDataFetching: () => {},
});

const PublicPageProvider = ({ children }: { children: ReactNode }) => {
  const [BrandList, setBrandList] = useState<any[]>([]);
  const [CategoryList, setCategoryList] = useState<any[]>([]);
  const [isDataFetching, setIsDataFetching] = useState<boolean>(false)
  return (
    <PublicPageContext.Provider
      value={{
        BrandList,
        setBrandList,
        CategoryList,
        setCategoryList,
        isDataFetching,
        setIsDataFetching,
      }}
    >
      {children}
    </PublicPageContext.Provider>
  );
};
export default PublicPageProvider;
