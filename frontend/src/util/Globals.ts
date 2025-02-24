// Server URL
const PRODUCTION_URL = "http://10.0.2.2:8080"; 

// Controller Endpoints
const AUTH = "/auth";
const USER = "/user";
const PRODUCT = "/product";
const SUPPLIERS = "/suppliers";
const AGENTS = "/agents";
const BUSINESS = "/business";
const ORDER = "/orders"
// Globals Object
export const globals = {
    PRODUCTION_URL,

    AUTH: {
        register: `${PRODUCTION_URL}${AUTH}/register`,
        login: `${PRODUCTION_URL}${AUTH}/login`,
        forgotPassword: `${PRODUCTION_URL}${AUTH}/forgotPassword`,
        google: `${PRODUCTION_URL}${AUTH}/google`,

    },

    BUSINESS: {
        getBusinessSuppliers: `${PRODUCTION_URL}${BUSINESS}/getBusinessSuppliers`,
        getBusinessSuppliersAndAgents: `${PRODUCTION_URL}${BUSINESS}/getBusinessSuppliersAndAgents`,
        getBusinessProducts: `${PRODUCTION_URL}${BUSINESS}/getBusinessProducts`,
        deleteSupplierFromBusiness: `${PRODUCTION_URL}${BUSINESS}/deleteSupplierFromBusiness`,
        updateAgent: `${PRODUCTION_URL}${BUSINESS}/updateAgent`,
    },

    USER: {
        resetPassword: `${PRODUCTION_URL}${USER}/resetPassword`,
        createUser: `${PRODUCTION_URL}${USER}/createUser`,
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
    },

    ORDER: {
        CreateOrder: `${PRODUCTION_URL}${ORDER}/CreateOrder`,
        getOrders: `${PRODUCTION_URL}${ORDER}/getOrders`,
        getOrderInfo: `${PRODUCTION_URL}${ORDER}/getOrderInfo`,
    }
};