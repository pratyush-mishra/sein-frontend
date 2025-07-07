export interface SignUp {
    username?: string,
    email?: string,
    password?: string,
    re_password?: string,
};

export interface SignIn {
    email: string,
    password: string
};

export interface AuthResponse {
    auth_token:string,
    non_field_errors?: string[]
}

export interface SignUpResponse {
    username: string | string[],
    email: string | string[],
    password?: string[],
    re_password?: string[],
    id?: number
}

export interface UserData {
    id: string,
    email: string,
    username: string,
    bio: string | null,
    contact_details: string | null,
    profile_picture: string | null
}

export interface ProfileData {
    email?: string,
    username?: string,
    bio?: string,
    contact_details?: string
}