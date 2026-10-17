import React, { useEffect, useRef, useState } from "react";

import { IoSearchOutline } from "react-icons/io5";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import "smarters-ino-ui-tv/dist/main.css";
import { Keyboard } from "@/shared/components/Keyboard/Keyboard";
import { useSelector } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { useDispatch } from "react-redux";
import { useTranslate } from "@/shared/hooks/languages/useI18";

const Search: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const prevRootControl = useSelector(
    (state: any) => state.rootControl.prevRootControl
  );

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("search", { detail: value }));
  }, [value]);

  const dispatch = useDispatch();

  const { t } = useTranslate();

  // Listen for closeKeyboard event from promotion
  useEffect(() => {
    const handleCloseKeyboard = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener("closeKeyboard", handleCloseKeyboard);

    return () => {
      window.removeEventListener("closeKeyboard", handleCloseKeyboard);
    };
  }, []);

  const onCloseKeyboard = () => {
    setIsKeyboardOpen(false);
    dispatch(setRootControl(prevRootControl!));
    window.keyboard_open = false;
  };

  const controls = {
    isActive: rootControl === ROOT_CONTROL.HEADER_SEARCH,
    id: "search-input",
    ok: () => {
      if (inputRef.current) {
        dispatch(setPrevRootControl(rootControl));
        dispatch(setRootControl(ROOT_CONTROL.CHAT_KEYBOARD_OPEN));
        setIsKeyboardOpen(true);

        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    },
    back: () => {
      dispatch(setRootControl(prevRootControl));
    },
    down: () => {
      dispatch(setRootControl(ROOT_CONTROL.MOVIES_LIST));
    },
    left: () => {
      dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    },
  };

  useKeydown(controls);

  return (
    <div
      className={`header__search ${
        rootControl === ROOT_CONTROL.HEADER_SEARCH ? "active" : ""
      }`}
      // onClick={() => {
      //   controls.ok();
      // }}
    >
      <div className="header__search-icon">
        <IoSearchOutline
          style={{
            color: "white",
            fontSize: "2.5rem",
          }}
        />
      </div>
      <input
        style={{ width: "100%" }}
        id="search-input"
        type="text"
        placeholder={`${t('search')}`}
        value={value}
        onClick={() => {
          controls.ok();
        }}
        ref={inputRef}
        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
      />
      <Keyboard isOpen={isKeyboardOpen} value={value} onChange={setValue} onClose={onCloseKeyboard} />
    </div>
  );
};

export default Search;
