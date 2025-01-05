export function convertToGMT(localDateTime: Date): Date {
    const localDate = new Date(localDateTime);
    const gmtDate = new Date(localDate.getTime() + (localDate.getTimezoneOffset() * 60000));
    return gmtDate;
}

export function setAlertClasses(alertMessage: string): string | undefined {
    if (alertMessage.startsWith("Error")) {
        return "alert alert-error"
    } else if (alertMessage.startsWith("Warning")) {
        return "alert alert-warning";
    } else if (alertMessage.startsWith("Success")) {
        console.log("Checkpoint 1");
        return "alert alert-success"
    } else {
        return "alert alert-info"
    }
}