import { NextRequest, NextResponse } from "next/server";
import { AuthResponse, SignIn, SignUp, SignUpResponse } from "@/app/api/Interfaces";
import { POST } from "../../api";

export async function sign_in(data: SignIn) : Promise<AuthResponse> {
    const res = await POST<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/create/`, data)
    return res;
}

export async function sign_up(data: SignUp) : Promise<SignUpResponse> {
    const res = await POST<SignUpResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/`, data)
    return res;
}
