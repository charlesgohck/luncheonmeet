export const VALID_USERNAME_REGEX: RegExp = /^[a-zA-Z0-9-]+$/;
export const VALID_DISPLAY_NAME_REGEX: RegExp = /^[a-zA-Z0-9-.!?\s%]+$/;
export const VALID_ABOUT_ME_REGEX: RegExp = /^[a-zA-Z0-9-.!?\s%]+$/;
export const VALID_GUID: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const VALID_TITLE: RegExp = /^[a-zA-Z0-9\s!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]{0,200}$/;
export const VALID_DESCRIPTION = /^[a-zA-Z0-9\s!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]{0,500}$/;

export function isBefore(date1: Date, date2: Date): boolean {
    return date1 < date2;
}