import { useUploadPlaylistMutation } from "@/services/Media/Backend/AppPlaylist";
import { useCallback } from "react";

export const useOnUploadPlaylist = () => {
    const [uploadPlaylist, { isLoading }] = useUploadPlaylistMutation();

    const onUploadPlaylist = useCallback(async (playlistId: string, file: FormData) => {
        try {
            await uploadPlaylist({ playlistId, file })
        }
        catch (e) {
            console.log(e)
        }
    }, [uploadPlaylist]);

    return { onUploadPlaylist, isLoading }
}