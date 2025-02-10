// Server URL
const PRODUCTION_URL = "http://10.0.2.2:8080"; // Replace with your actual server address

// Controller Endpoints
const AUTH = "/auth";
const PRODUCT = "/product";

// Globals Object
export const globals = {
    AUTH: {
        register: `${PRODUCTION_URL}${AUTH}/register`,
        login: `${PRODUCTION_URL}${AUTH}/login`,
        google: `${PRODUCTION_URL}${AUTH}/google`,
    },
};
