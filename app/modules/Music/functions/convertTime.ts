export const convertTime = (seconds: number, duration: number) => {
    // Validate inputs to prevent null:INFINITY and other invalid displays
    const isValidNumber = (num: any): boolean => {
        return (
            num !== null &&
            num !== undefined &&
            !isNaN(num) &&
            isFinite(num) &&
            num >= 0
        );
    };

    // Return default if inputs are invalid
    if (!isValidNumber(seconds) || !isValidNumber(duration)) {
        return "00:00";
    }

    // Clamp seconds to reasonable bounds
    const clampedSeconds = Math.max(0, Math.min(seconds, 86400)); // Max 24 hours
    const clampedDuration = Math.max(0, Math.min(duration, 86400)); // Max 24 hours

    let hrs: number | string = Math.floor(clampedSeconds / 3600);
    let min: number | string = Math.floor((clampedSeconds % 3600) / 60);
    let sec: number | string = Math.floor(clampedSeconds % 60);

    hrs = hrs < 10 ? "0" + hrs : hrs;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return clampedDuration >= 3600 ? `${hrs}:${min}:${sec}` : `${min}:${sec}`;
}
