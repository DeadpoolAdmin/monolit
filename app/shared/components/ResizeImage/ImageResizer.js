class ImageResizer {

    quality = 0.5;
    aspectRatio = true;
    queue = [];
    resizing = false;
    resizedImages = {};
    queueTimeout = null;
    ctx = null;

    resize({ src, width, height, quality, format, aspectRatio, blur, successCb, errorCb }) {
        if (typeof aspectRatio === "undefined") aspectRatio = this.aspectRatio;
        if (typeof quality === "undefined") quality = this.quality;

        if (!src || !width || !height || !successCb || !errorCb) {
            console.warn("ImageResizer: missing required params src, width, height, successCb, errorCb");
            try { errorCb() } catch (e) { }
            return () => { };
        }

        let key = src + ":" + width + "x" + height;

        const resizedImage = this.resizedImages[key];

        let cancelResize = () => { };

        if (resizedImage) {
            successCb(resizedImage);
        } else {

            const image = new Image();

            // image.crossOrigin = 'anonymous'; // commented getting green image for android

            let item = {
                key,
                src,
                width,
                height,
                quality,
                format,
                aspectRatio,
                successCb,
                errorCb,
                image,
                skip: false,
                blur,
            }

            image.onload = () => {
                this.queue.push(item);
                this.processQueue();
            }

            image.onerror = (e) => {

                if (!image.crossOrigin) {
                    image.crossOrigin = "anonymous";
                    image.src = src;
                    return;
                } else {
                    errorCb();
                }

            }

            image.src = src;

            cancelResize = () => {
                item.skip = true;
                let index = this.queue.indexOf(item);
                if (index > -1) this.queue.splice(index, 1);
                image.onload = () => { };
                image.onerror = () => { };
                image.src = "";
            }

        }

        return cancelResize;

    }

    // crop 960x540 area from the 1920x1080 image x: 600, y: 170
    // cropImage({ src, width, height, x, y, successCb, errorCb }) {

    processQueue() {

        if (this.queue.length === 0 || this.resizing || window.transforming) return;

        const next = () => {
            clearTimeout(this.queueTimeout);
            this.queueTimeout = setTimeout(() => {
                this.resizing = false;
                this.processQueue();
            }, 10);
        }

        this.resizing = true;

        let item = this.queue.shift();

        if (item.skip) return next();

        var canvas = this.canvas; //document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (item.aspectRatio) {

            let ratio = item.image.width / item.image.height;

            if (ratio > 1) {
                canvas.width = item.width;
                canvas.height = item.width / ratio;
            } else {
                canvas.width = item.height * ratio;
                canvas.height = item.height;
            }

            item.width = canvas.width;
            item.height = canvas.height;

        } else {
            canvas.width = item.width;
            canvas.height = item.height;
        }

        if (item.blur) {
            ctx.filter = `blur(${item.blur}px)`;
        }

        try {

            ctx.drawImage(item.image, 0, 0, item.width, item.height);

            let format = item.format || "jpeg";

            let src = canvas.toDataURL('image/' + format, item.quality || this.quality);

            this.resizedImages[item.key] = src;

            item.successCb(src);

        } catch (e) {
            item.successCb(item.src);
        }

        next();

    }

    clean() {
        this.queue = [];
        this.resizedImages = {};
    }

}

const resizer = new ImageResizer();

resizer.canvas = document.createElement('canvas');

window.addEventListener("transformend", () => {
    resizer.processQueue();
});

window.addEventListener("cleanImageResizer", () => {
    console.log("cleanImageResizer");
    resizer.clean();
});

export default resizer