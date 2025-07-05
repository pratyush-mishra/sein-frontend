import { NextRequest, NextResponse } from "next/server";
import { AuthResponse, SignIn, SignUp, SignUpResponse } from "@/app/api/Interfaces";

export async function POST<T>(url: string, body: any) : Promise<T> {
     const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Login failed");
    }
    const response_data : T = await res.json();
    return response_data;
    
}
export async function sign_in(data: SignIn) : Promise<AuthResponse> {
    const res = await POST<AuthResponse>("http://localhost:8000/auth/token/login/", data)
    return res;
}

export async function sign_up(data: SignUp) : Promise<SignUpResponse> {
    const res = await POST<SignUpResponse>("http://localhost:8000/auth/users/", data)
    return res;
}
