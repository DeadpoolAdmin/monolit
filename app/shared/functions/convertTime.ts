export const convertTime = (seconds : number) => {
    // Handle NaN or invalid values
    if (isNaN(seconds) || seconds === null || seconds === undefined) {
        return "00:00:00";
    }

    let hrs = Math.floor(seconds / 3600);
    let min = Math.floor((seconds % 3600) / 60);
    let sec = seconds % 60;

    const hrsStr = hrs < 10 ? "0" + hrs : hrs.toString();
    const minStr = min < 10 ? "0" + min : min.toString();
    const secStr = sec < 10 ? "0" + sec : sec.toString();

    const timeString = hrsStr + ":" + minStr + ":" + secStr;

    return timeString

    // totalTime(Math.round(duration), playedSeconds);
}

export const totalTime = (seconds: number) => {
    // Handle NaN or invalid values
    if (isNaN(seconds) || seconds === null || seconds === undefined) {
        return "00:00:00";
    }

    let hrs = Math.floor(seconds / 3600);
    let min = Math.floor((seconds % 3600) / 60);
    let sec = seconds % 60;

    const hrsStr = hrs < 10 ? "0" + hrs : hrs.toString();
    const minStr = min < 10 ? "0" + min : min.toString();
    const secStr = sec < 10 ? "0" + sec : sec.toString();

    return hrsStr + ":" + minStr + ":" + secStr;
}

export function addSecondsToTime(timeStr: string, secondsToAdd: number) {
    let parts = timeStr.split(":").map(Number);
    let hours, minutes, seconds;

    if (parts.length === 2) {
        // Format: MM:SS
        [minutes, seconds] = parts;
        hours = 0; // Default to 0 if no hours provided
    } else if (parts.length === 3) {
        // Format: HH:MM:SS
        [hours, minutes, seconds] = parts;
    } else {
        throw new Error("Invalid time format. Use MM:SS or HH:MM:SS.");
    }

    let hashvark = hours * 3600 + minutes * 60 + seconds;

    hashvark += secondsToAdd

    let totalSeconds = hashvark;

    let newHours = Math.floor(totalSeconds / 3600);
    let newMinutes = Math.floor((totalSeconds % 3600) / 60);
    let newSeconds = totalSeconds % 60;

    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
}