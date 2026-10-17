import React, { useEffect } from "react";
import LanguageList from "./components/List";

import "./styles/index.scss";
import Title from "./components/Title";
import { useGetBranding } from "@/shared/hooks/useGetBranding";

const Languages = () => {
  const { getBrandingData } = useGetBranding();

  useEffect(() => {
    getBrandingData();
  }, []);

  return (
    <div className="languages">
      <Title />
      <LanguageList />
    </div>
  );
};

export default Languages;
