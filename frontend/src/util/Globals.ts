// Server URL
const PRODUCTION_URL = "http://10.0.2.2:8080"; 

// Controller Endpoints
const AUTH = "/auth";
const USER = "/user";
const PRODUCT = "/product";
const SUPPLIERS = "/suppliers";
const AGENTS = "/agents";
const BUSINESS = "/business";

// Globals Object
export const globals = {


    AUTH: {
        register: `${PRODUCTION_URL}${AUTH}/register`,
        login: `${PRODUCTION_URL}${AUTH}/login`,
        forgotPassword: `${PRODUCTION_URL}${AUTH}/forgotPassword`,
        google: `${PRODUCTION_URL}${AUTH}/google`,

    },

    BUSINESS: {
        getBusinessSuppliers: `${PRODUCTION_URL}${BUSINESS}/getBusinessSuppliers`
    },

    USER: {
        resetPassword: `${PRODUCTION_URL}${USER}/resetPassword`,
    },

    SUPPLIERS:{
     createSupplier: `${PRODUCTION_URL}${SUPPLIERS}/createSupplier`,
     getAllSuppliers: `${PRODUCTION_URL}${SUPPLIERS}/getAllSuppliers`,
     deleteSupplier: `${PRODUCTION_URL}${SUPPLIERS}/deleteSupplier`,
    },

    AGENTS: {
        addAgent: `${PRODUCTION_URL}${AGENTS}/addAgent`,
    },

    PRODUCT:{
    createProduct: `${PRODUCTION_URL}${PRODUCT}/createProduct`,
    displayProducts: `${PRODUCTION_URL}${PRODUCT}/displayProducts`,
    fetchProduct: `${PRODUCTION_URL}${PRODUCT}/fetchProduct`,

    }
};