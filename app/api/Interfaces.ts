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
};

export interface SignUpResponse {
    username: string | string[],
    email: string | string[],
    password?: string[],
    re_password?: string[],
    id?: number
};


export interface UserData {
    id: string,
    email: string,
    username: string,
    bio: string | null,
    contact_details: string | null,
    profile_picture: string | null
};

export interface ProfileData {
    email?: string,
    username?: string,
    bio?: string,
    contact_details?: string
};

export interface ImageUploadProps {
    maxFiles?: number;
    maxSize?: number;
    acceptedTypes?: string[];
    onImagesChange?: (files: File[]) => void;
};

export interface CreateListing {
    title: string,
    description: string,
    category?: string | string[],
    qty?: number,
    is_fee?: boolean,
    fee?: number,
    dimensions?: string,
    availability?: string | string[],
    condition?: string,
    comment?: string,
    image: File | File[],
    contact_details?: string
};

export interface CreateListingResponse {
    id?: number,
    owner?: any,
    title?: string | string[],
    description?: string | string[],
    image?: string | string[],
    contact_details?: string | string[],
    is_approved?: boolean | string[],
    created_at?: Date | string[],
    updated_at?: Date | string[],
};

export interface Listing {
    id: number;
    owner?: object,
    title: string;
    description: string;
    image?: string;
    contact_details?: string;
    category?: string;
    qty?: number;
    is_fee?: boolean;
    fee?: number;
    dimensions?: string;
    availability?: string;
    condition?: string;
    comment?: string;
    created_at?: string;
    updated_at?: string;
  };

