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
export async function POST_AUTH<T>(url: string, token:string, body: any) : Promise<T> {
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

export async function GET<T>(url: string, token: any) : Promise<T> {
     const res = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "Token " + token,
        },
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "GET failed");
    }
    const response_data : T = await res.json();
    return response_data;
    
}

export async function PATCH<T>(url: string, token: string, body: any) : Promise<T> {
     const res = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json",
            "Authorization": "Token " + token,
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "GET failed");
    }
    const response_data : T = await res.json();
    return response_data;
    
}