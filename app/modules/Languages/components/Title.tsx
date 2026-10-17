import React from "react";
import { useTranslate } from "@/shared/hooks/languages/useI18";

const Title = () => {
  const { t } = useTranslate();

  return (
    <>
      <div className="lang__title">
        <span>{t('chooseLanguage')}</span>
      </div>

      <div className="lang__subtitle">
        <span>{t('selectPreferredLanguage')}</span>
      </div>
    </>
  );
};

export default Title;
