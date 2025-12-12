import 'dotenv/config';

export default ({ config }) => {
    // 'config' es el objeto que viene de tu app.json.
    // Lo extendemos para no duplicar la información.
    return {
        ...config,
        // La propiedad "extra" es donde exponemos nuestras variables.
        // Se fusionará con cualquier 'extra' que ya exista en app.json.
        extra: {
            ...config.extra, // Mantenemos cualquier valor previo en 'extra'.
            API_BASE_URL_DEV: process.env.API_BASE_URL_DEV,
            API_BASE_URL_PROD: process.env.API_BASE_URL_PROD,
        },
    };
};