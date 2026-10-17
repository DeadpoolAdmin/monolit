import { useTranslate } from "@/shared/hooks/languages/useI18";
import React from "react";

const ActivationMobileHeader = () => {

  const { t } = useTranslate();

  return (
    <>
      <div className="content__title">
        <span className="content__title__text">{t('scanTheQRCode')}</span>
        <span className="content__title__subtitle">
          {t('toUseOurMobileAppAndUnlockTheFullSmartRoomExperience')}
        </span>
      </div>
    </>
  );
};

export default ActivationMobileHeader;
