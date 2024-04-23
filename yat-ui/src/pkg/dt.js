export default function getCurrentUTCTimestamp() {
    return Math.floor(Date.now() / 1000);
}

function convertDateToUTCTimestamp(date) {
    return Math.floor(date.getTime() / 1000);
}

function convertUTCTimestampToDate(timestamp) {
    return new Date(timestamp * 1000);
}
