export function convertToGMT(localDateTime: Date): Date {
    const localDate = new Date(localDateTime);
    const gmtDate = new Date(localDate.getTime() + (localDate.getTimezoneOffset() * 60000));
    return gmtDate;
}
