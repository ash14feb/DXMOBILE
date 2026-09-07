const BASE_URL = 'https://dxmobileapi.vercel.app/mobapp_api';
//const BASE_URL = 'http://localhost:3001/mobapp_api';
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

const getHeaders = () => {
    const token = localStorage.getItem('mobapp_token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response: Response, isAuthRequest: boolean = false) => {
    if (response.status === 401 && !isAuthRequest) {
        localStorage.removeItem('mobapp_token');
        localStorage.removeItem('mobapp_customer');
        localStorage.removeItem('mobapp_cards');
        window.location.reload();
        throw new ApiError('Session expired', 401);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
        throw new ApiError(data.message || 'An error occurred', response.status || 400);
    }

    return data;
};

export const api = {
    get: async (endpoint: string) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    post: async (endpoint: string, body: any) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(response, endpoint.includes('/auth/'));
    },
};
