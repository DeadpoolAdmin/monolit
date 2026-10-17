import { useCallback, useEffect, useRef, useState } from "react"

export const useVideoPlayer = (
    visibiltyTimeout: React.MutableRefObject<NodeJS.Timeout | null>, 
    controlRef: React.RefObject<HTMLDivElement>
) => {

    const videoRef = useRef<any>(null)

    const timeRef = useRef<NodeJS.Timeout | null>(null)

    const [playing, setPlaying] = useState<boolean>(true)

    const [muted, setMuted] = useState<boolean>(false)

    function isWebos() {
        return /Web0S|WebOS/i.test(navigator.userAgent);
    }

    const onReady = useCallback(() => {
        try {
            const liveTv = document.querySelector('.livetv') as HTMLDivElement
            if (window.Android) {
                if (liveTv) {
                    liveTv.style.background = 'transparent'
                }
            }

        }
        catch (e) {
            console.log(e)
        }
    }, [])


    useEffect(() => {
        return () => {
            if (timeRef.current) {
                clearTimeout(timeRef.current)
                timeRef.current = null
            }
            if (visibiltyTimeout.current) {
                clearTimeout(visibiltyTimeout.current)
                visibiltyTimeout.current = null
            }
            setPlaying(false)
        }
    }, [visibiltyTimeout])

    useEffect(() => {
        if (window.Android || window.tizen || isWebos()) {
            setMuted(false)
            return
        }

        setMuted(true)
    }, [])

    return {
        videoRef,
        onReady,
        playing,
        muted
    }
}