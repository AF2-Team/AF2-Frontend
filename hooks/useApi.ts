import { useCallback, useState } from 'react';

export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    status: number;
}

export interface ApiConfig {
    baseURL: string;
    timeout?: number;
}

const DEFAULT_CONFIG: ApiConfig = {
    baseURL: 'http://192.168.1.2:3000/api/v1',
    timeout: 30000,
};

export const useApi = (config?: Partial<ApiConfig>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const apiConfig: ApiConfig = { ...DEFAULT_CONFIG, ...config };

    const request = useCallback(
        async <T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
            setIsLoading(true);
            setError(null);

            try {
                const url = `${apiConfig.baseURL}${endpoint}`;

                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options?.headers,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    return {
                        status: response.status,
                        error: data.message || 'Error en la petición',
                    };
                }

                return {
                    status: response.status,
                    data: data as T,
                };
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
                setError(errorMessage);

                return {
                    status: 500,
                    error: errorMessage,
                };
            } finally {
                setIsLoading(false);
            }
        },
        [apiConfig.baseURL],
    );

    const get = useCallback(<T = any>(endpoint: string) => request<T>(endpoint, { method: 'GET' }), [request]);
    const post = useCallback(
        <T = any>(endpoint: string, body?: any) =>
            request<T>(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
            }),
        [request],
    );
    const put = useCallback(
        <T = any>(endpoint: string, body?: any) =>
            request<T>(endpoint, {
                method: 'PUT',
                body: JSON.stringify(body),
            }),
        [request],
    );
    const _delete = useCallback(<T = any>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }), [request]);

    return {
        request,
        get,
        post,
        put,
        delete: _delete,
        isLoading,
        error,
        clearError: () => setError(null),
    };
};
