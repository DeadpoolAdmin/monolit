import noWifi from "@/assets/noWifi.png";

export const storeImageInLocalStorage = async (url: string, key: string): Promise<void> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                localStorage.setItem(key, reader.result as string);
            } else {
                console.error("Failed to read image data");
            }
        };
        reader.onerror = () => {
            console.error("Failed to read image file");
        };
        reader.readAsDataURL(blob);
    } catch (error) {
        console.error("Error storing image in localStorage:", error);
    }
};

// Initialize on module load
storeImageInLocalStorage(noWifi, "offlineBannerImage");