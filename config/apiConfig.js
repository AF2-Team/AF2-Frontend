import Constants from 'expo-constants';

//Las variables inyectadas
const { API_BASE_URL_DEV, API_BASE_URL_PROD } = Constants.expoConfig.extra;

// Usar la variable global __DEV__ para decidir el entorno
//__DEV__ es TRUE si se corre con npx expo start, FALSE en un build de producción
const IS_DEV = __DEV__;

export const API_BASE_URL = IS_DEV ? API_BASE_URL_DEV : API_BASE_URL_PROD;

if (!API_BASE_URL) {
    console.error("CRITICAL ERROR: API_BASE_URL is undefined. Check .env and app.config.js");
}