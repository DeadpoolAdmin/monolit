import { useGetLanguages } from "@/shared/hooks/mutations/useGetLanguages";
import ILanguages from "@/shared/types/languages/languages";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ListView } from "smarters-ino-ui-tv";
import "smarters-ino-ui-tv/dist/main.css";

import { FaCheck } from "react-icons/fa";
import Loader from "@/shared/components/Loader/Loader";
import ScrollView from "@/shared/components/ScrollView/ScrollView";
import { useTranslate } from "@/shared/hooks/languages/useI18";

const LanguageList = () => {
  const { getLanguagesData, languagesLoading } = useGetLanguages();
  const { changeLanguage } = useTranslate();

  const [isActive, setIsActive] = useState<boolean>(false);

  const [languages, setLanguages] = useState<ILanguages[]>([]);

  const lang = localStorage.getItem("lang") as string;

  const [chosenLanguage] = React.useState<string | null>(lang);

  const navigate = useNavigate();

  const searchParams = usePolyfillSearchParams();

  const { getDeviceType } = useResolution();

  const deviceType = getDeviceType();

  const onGetLanguagesData = async (token: string) => {
    try {
      const data = await getLanguagesData(token);

      // Find English language (code: 'en') and put it as the first element
      let englishLang = data.find((lang: ILanguages) => lang.code === "en");
      let otherLangs = data.filter((lang: ILanguages) => lang.code !== "en");
      setLanguages(englishLang ? [englishLang, ...otherLangs] : data);
    } catch (e) {
      console.log(e);
    }
  };

  const onOk = (item: ILanguages) => {
    // Update localStorage
    localStorage.setItem("lang", item.code);

    // Update i18next language
    changeLanguage(item.code);

    const search = searchParams.toString();

    navigate(`/welcome${search ? `?${search}` : ""}`);
  };

  const controls = {
    id: "control-language",
    usActive: isActive,
    up: () => {
      window.transforming = true;
      window.dispatchEvent(new Event("transformstart"));
      // Dispatch transformend after a short delay to allow images to process
      setTimeout(() => {
        window.transforming = false;
        window.dispatchEvent(new Event("transformend"));
      }, 100);
    },
    down: () => {
      window.transforming = true;
      window.dispatchEvent(new Event("transformstart"));
      // Dispatch transformend after a short delay to allow images to process
      setTimeout(() => {
        window.transforming = false;
        window.dispatchEvent(new Event("transformend"));
      }, 100);
    },
    back: () => {},
  };

  useKeydown(controls);

  useEffect(() => {
    onGetLanguagesData(localStorage.getItem("token") as string);
  }, []);

  useEffect(() => {
    setIsActive(true);
  }, []);

  if (languagesLoading) {
    return (
      <Loader
        style={{
          background: "transparent",
          height: "15rem",
          width: "15rem",
          position: "fixed",
          top: "42rem",
          left: "90rem",
          zIndex: 1000,
        }}
      />
    );
  }

  return languages && languages.length ? (
    <div
      className="lang__list"
      style={{
        overflow: "hidden",
        scrollbarWidth: "none",
      }}
    >
      {deviceType !== "TV" ? (
        <ScrollView
          data={languages}
          width={100}
          dimension={"rem"}
          listType={"grid"}
          type={"gird-movies"}
          renderItem={({
            style,
            item,
            isActive,
            key,
          }: {
            style: React.CSSProperties;
            item: ILanguages;
            isActive: boolean;
            key: React.Key;
          }) => (
            <div
              onClick={() => onOk(item)}
              className={`lang__item ${isActive ? "active" : ""}`}
              key={key}
              style={{
                ...style,
                width: 100 + "rem",
                height: 13 + "rem",
                margin: "1.5rem 0",
              }}
            >
              <div className="item__img">
                <img src={item.icon} alt={item.name} />
              </div>
              <div className="item__name">{item.name}</div>

              {chosenLanguage && chosenLanguage === item.code ? (
                <div className="item__selected">
                  <FaCheck />
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        />
      ) : (
        <ListView
          id="list"
          isActive={isActive}
          itemsCount={5}
          itemsTotal={languages.length}
          itemHeight={13}
          startScrollIndex={0}
          itemWidth={100}
          direction="ltr"
          data={languages}
          // onDown={onDown}
          rowGap={2}
          buffer={6}
          onOk={(item) => onOk(item)}
          gap={2}
          listType="vertical"
          nativeControle={true}
          renderItem={({ style, item, isActive, key }) => (
            <div
              onClick={() => onOk(item)}
              className={`lang__item ${isActive ? "active" : ""}`}
              key={key}
              style={style}
            >
              <div className="item__img">
                <img src={item.icon} alt={item.name} />
              </div>
              <div className="item__name">{item.name}</div>

              {chosenLanguage && chosenLanguage === item.code ? (
                <div className="item__selected">
                  <FaCheck />
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        />
      )}
    </div>
  ) : (
    <></>
  );
};

export default LanguageList;
