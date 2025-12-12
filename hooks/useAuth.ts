import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';
import { useApi } from './useApi';

const AUTH_STORAGE_KEY = '@auth_data';

export const useAuth = () => {
    const { post, isLoading, error } = useApi();
    const [userData, setUserData] = useState<LoginResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Cargar datos al iniciar
    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
            if (stored) {
                const parsedData = JSON.parse(stored);
                setUserData(parsedData);
                setIsAuthenticated(true);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const login = async (credentials: LoginRequest) => {
        const response = await post<LoginResponse>('/auth/login', credentials);

        if (response.data) {
            await saveAuthData(response.data);
            setUserData(response.data);
            setIsAuthenticated(true);
        }

        return response;
    };

    const register = async (userData: RegisterRequest) => {
        const response = await post<RegisterResponse>('/auth/register', userData);

        return response;
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
            setUserData(null);
            setIsAuthenticated(false);
            return { success: true };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            return {
                success: false,
                error: 'Error al cerrar sesión',
            };
        }
    };

    const saveAuthData = async (data: LoginResponse) => {
        try {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));

            return true;
        } catch (err) {
            console.error('Error saving auth data:', err);
            return false;
        }
    };

    return {
        login,
        register,
        logout,
        userData,
        isAuthenticated,
        isLoading,
        error,
    };
};
