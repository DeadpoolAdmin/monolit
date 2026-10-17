import React, { useEffect, useState } from "react";
import ResizeImage from "@/shared/components/ResizeImage/ResizeImage";
import { SmartDeviceType } from "../types/room_control.enum";

interface RoomControlItemImagesProps {
  item: any;
  isToggled: boolean;
  curtainImageRef?: React.RefObject<HTMLDivElement>;
  blindImageRef?: React.RefObject<HTMLDivElement>;
}

export const RoomControlItemImages: React.FC<RoomControlItemImagesProps> = ({
  item,
  isToggled,
  curtainImageRef,
  blindImageRef,
}) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const handleCurtainOpen = () => {
      curtainImageRef?.current?.classList.add("show");
    };

    const handleCurtainClose = () => {
      curtainImageRef?.current?.classList.remove("show");
    };

    const handleBlindOpen = () => {
      blindImageRef?.current?.classList.add("show");
    };

    const handleBlindClose = () => {
      blindImageRef?.current?.classList.remove("show");
    };

    window.addEventListener("curtainOpen", handleCurtainOpen);
    window.addEventListener("curtainClose", handleCurtainClose);
    window.addEventListener("blindOpen", handleBlindOpen);
    window.addEventListener("blindClose", handleBlindClose);

    return () => {
      window.removeEventListener("curtainOpen", handleCurtainOpen);
      window.removeEventListener("curtainClose", handleCurtainClose);
      window.removeEventListener("blindOpen", handleBlindOpen);
      window.removeEventListener("blindClose", handleBlindClose);
    };
  }, [curtainImageRef, blindImageRef]);

  useEffect(() => {
    // Preload images for smooth transitions
    const imagesToPreload = [item.icon, item.iconActive];
    if (item.iconShow) {
      imagesToPreload.push(item.iconShow);
    }

    let loadedCount = 0;
    const totalImages = imagesToPreload.filter(Boolean).length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        // Small delay to ensure smooth fade-in
        requestAnimationFrame(() => {
          setImagesLoaded(true);
        });
      }
    };

    imagesToPreload.forEach((src) => {
      if (src) {
        const img = new Image();
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad; // Still mark as loaded even on error
        img.src = src;
      }
    });

    return () => {
      setImagesLoaded(false);
    };
  }, [item.icon, item.iconActive, item.iconShow]);

  return (
    <>
      <div className={`content__image ${item.name} ${imagesLoaded ? "loaded" : "loading"}`}>
        <div className="image-wrapper">
          {item.name === SmartDeviceType.curtain ? (
            <div ref={curtainImageRef} className="curtain-images">
              {/* Default icon - shown when curtain is CLOSED */}
              <ResizeImage
                className="img default show smooth-fade"
                placeholder={item.icon}
                width={11.7}
                height={11.7}
                format="png"
                quality={0.5}
                aspectRatio={true}
                src={item.icon}
                alt={item.displayName || item.title}
              />

              {/* Active icon - shown when curtain is OPEN */}
              <ResizeImage
                className="img active hide smooth-fade"
                placeholder={item.iconActive}
                width={11.7}
                height={11.7}
                format="png"
                quality={0.5}
                aspectRatio={true}
                src={item.iconActive}
                alt={item.displayName || item.title}
              />
            </div>
          ) : item.name === SmartDeviceType.blind ? (
            <div ref={blindImageRef} className="blind-images">
              {/* Default icon - shown when blind is CLOSED */}
              <ResizeImage
                className="img default show smooth-fade"
                placeholder={item.icon}
                width={11.7}
                height={11.7}
                format="png"
                quality={0.5}
                aspectRatio={true}
                src={item.icon}
                alt={item.displayName || item.title}
              />

              {/* Active icon - shown when blind is OPEN */}
              <ResizeImage
                className="img active hide smooth-fade"
                placeholder={item.iconActive}
                width={11.7}
                height={11.7}
                format="png"
                quality={0.5}
                aspectRatio={true}
                src={item.iconActive}
                alt={item.displayName || item.title}
              />
            </div>
          ) : (
            <>
              <ResizeImage
                className={`img default ${isToggled ? "hide" : "show"} smooth-fade`}
                placeholder={item.icon}
                width={11.7}
                height={11.7}
                format="png"
                quality={0.5}
                aspectRatio={true}
                src={item.icon}
                alt={item.displayName || item.title}
              />

              <ResizeImage
                className={`img active ${isToggled ? "show" : "hide"} smooth-fade`}
                placeholder={item.iconActive}
                width={11.7}
                height={11.7}
                format="png"
                quality={0.5}
                aspectRatio={true}
                src={item.iconActive}
                alt={item.displayName || item.title}
              />
            </>
          )}
        </div>
      </div>
      {(item.name === SmartDeviceType.masterLight ||
        item.name === SmartDeviceType.bedLight) && (
        <div className={`image_show ${imagesLoaded ? "loaded" : "loading"}`}>
          <ResizeImage
            className={`img ${isToggled ? "show" : "hide"} ${item.name} smooth-fade`}
            placeholder={item.iconShow}
            width={11.7}
            height={11.7}
            format="png"
            quality={0.5}
            aspectRatio={true}
            src={item.iconShow}
            alt={item.displayName || item.title}
          />
        </div>
      )}
    </>
  );
};
