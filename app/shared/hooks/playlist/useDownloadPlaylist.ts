import { useCallback, useState } from "react";

// helper function for downloading with XMLHttpRequest
function downloadWithXHR(url: string, onProgress?: (percent: number) => void): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(`Failed to download: ${xhr.status} ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => reject(new Error("Network error while downloading playlist"));
        xhr.ontimeout = () => reject(new Error("Request timed out"));

        if (onProgress) {
            xhr.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = (event.loaded / event.total) * 100;
                    onProgress(percent);
                }
            };
        }

        xhr.send();
    });
}

export const useDownloadPlaylist = (
    onUploadPlaylist: (playlistId: string, formData: FormData) => Promise<void>,
    onParsePlaylist: (playlistId: string) => Promise<void>
) => {
    const [playlistLoading, setPlaylistLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const downloadPlaylist = useCallback(
        async (playlistURL: string, playlistId: string) => {
            setPlaylistLoading(true);
            setError(null);
            setProgress(0);

            try {
                // Step 1: Download file with XHR
                const buffer = await downloadWithXHR(playlistURL, (p) => setProgress(p));

                // Step 2: Upload the file
                const blob = new Blob([buffer]);
                const formData = new FormData();
                formData.append("file", blob, `${playlistId}.m3u8`);

                await onUploadPlaylist(playlistId, formData);
                await onParsePlaylist(playlistId);

                localStorage.setItem("playlistId", playlistId);
            } catch (err: unknown) {
                let message = "Unexpected error occurred.";
                if (err instanceof Error) message = err.message;

                console.error("Download/Upload Error:", message);
                setError(message);

                // no throw → prevents crash
                return null;
            } finally {
                setPlaylistLoading(false);
                setProgress(100);
            }
        },
        [onUploadPlaylist, onParsePlaylist]
    );

    return { playlistLoading, error, progress, downloadPlaylist, setPlaylistLoading };
};
