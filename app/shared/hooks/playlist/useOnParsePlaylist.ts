import { usePlaylistParseMutation } from "@/services/Media/Backend/AppPlaylist";
import { useCallback } from "react";

export const useOnParsePlaylist = () => {
    const [parsePlaylist] = usePlaylistParseMutation()


    const onParsePlaylist = useCallback(async (playlist_id: string) => {
        try {
            await parsePlaylist({ playlistId: playlist_id })
        }
        catch (e) {
            console.log(e)
        }
    }, [parsePlaylist]);

    return { onParsePlaylist };
};