export interface Payload<PayLoadType> {
    message: string,
    payload: PayLoadType
}

export interface UserDetails {
    email: string,
    username: string,
    profile_picture: string,
    display_name: string,
    about_me: string
}

export interface UserDetailsWithoutPersonalInformation {
    username: string,
    display_name: string,
    about_me: string
}