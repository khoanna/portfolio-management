interface APICallProps {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    body?: {};
    endpoint: string;
    sendWithCookie?: boolean;
    sendWithHeaderToken?: boolean;
}


export default async function APICall({ method, body, endpoint, sendWithCookie, sendWithHeaderToken }: APICallProps) {

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    const requestOptions: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    if (sendWithCookie) {
        requestOptions.credentials = "include";
    }

    if (sendWithHeaderToken) {
        headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, requestOptions);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'OTP confirmation for password reset failed');
    }

    return data;
}
