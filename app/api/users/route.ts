import { UserData, ProfileData } from "../Interfaces";
import { POST, GET, PATCH } from "../api";

export async function get_profile(id: number, token: string) :  Promise<UserData> {
   return GET<UserData>("http://localhost:8000/api/users/"+id+"/", token);
}

export async function me_profile(token: string) : Promise<UserData> {
    return GET<UserData>("http://localhost:8000/auth/users/me/", token);
}

export async function patch_profile(token: string, profileData: ProfileData) : Promise<UserData> {
    return PATCH<UserData>("http://localhost:8000/auth/users/me/", token, profileData);
}