import React, { memo, useEffect, useRef } from "react";
import ImageResizer from "./ImageResizer";

const ResizeImage = (props) => {

    const imgRef = useRef(null);

    const tagname = props.tagname || "img";

    useEffect(() => {

        const img = imgRef.current;

        let timeout = null;
        let anim = null;

        const setSrc = (src) => {

            if (tagname == "div") {
                img.style.backgroundImage = src ? `url(${src})` : "none";
            } else {
                img.src = src;
            }

            // Use transition for smooth fade-in
            img.style.transition = "opacity 0.4s ease-in-out";
            img.style.opacity = src ? 1 : 0;

        }

        img.style.transition = "opacity 0.4s ease-in-out";
        img.style.opacity = 0;

        let cancelResize = () => { };

        let startResize = () => { };

        let successCb = (src) => {
            anim = requestAnimationFrame(() => {

                if (window.transforming) {
                    timeout = setTimeout(() => successCb(src), 100);
                    return;
                }

                setSrc(src);

            });

        }

        let errorCb = () => {
            setSrc(props.placeholder || "");
        }

        if (img && props.src) {

            const targetWidth = img.clientWidth;
            const targetHeight = img.clientHeight;

            let key = props.src + ":" + targetWidth + "x" + targetHeight;

            const resizedImage = ImageResizer.resizedImages[key];

            if (resizedImage) return setSrc(resizedImage);

            let resizeOptions = {
                src: props.src,
                aspectRatio: props.aspectRatio,
                quality: props.quality,
                format: props.format,
                width: targetWidth,
                height: targetHeight,
                blur: props.blur,
                successCb,
                errorCb
            }

            startResize = () => {
                cancelResize = ImageResizer.resize(resizeOptions);
            }

            startResize();

        } else {
            errorCb();
        }

        return () => {
            successCb = () => { };
            errorCb = () => { };
            cancelResize();
            cancelAnimationFrame(anim);
            clearTimeout(timeout);
        }

    }, [props.src]);

    if (tagname == "div") return (
        <div
            ref={imgRef}
            draggable={false}
            className={props.className || ""}
        // style={{
        //     width: "100%",
        //     height: "100%",
        //     backgroundSize: "cover",
        //     backgroundPosition: "center",
        //     backgroundRepeat: "no-repeat",
        // }}
        />
    )

    return <img
        ref={imgRef}
        draggable={false}
        className={props.className || ""}
    />

}

export default memo(ResizeImage);