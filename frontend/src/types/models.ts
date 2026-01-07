import { Double } from "react-native/Libraries/Types/CodegenTypes";

export type Supplier = {
    supplierId: number;
    companyName: string;
  };

  export type Agent = {
    id: number;
    name: string;
    email: string;
    phone: string;
  };

  export type SupplierDetails = {
    companyName: string;
    agent: Agent;
  };

export type Product = {
    id: string;
    supplier: Supplier;
    productName: string;
    description: string;
  };

  export type BusinessProduct = {
    product: Product;
    price: Double;
    stock: number;
    imageUrl: string;
  };
  // Order related types
export interface OrderProductDetails {
  productName: string;
  barcode: string;
  imageUrl: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  unitPrice: number;
  subtotal: number;
  return_requested: number;
  return_approved: number;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  AddSupplier: undefined;
  AddProduct: undefined;
  SuppliersList: undefined;
  ProductList: undefined;
  OrderList: undefined;
  ShoppingCart: undefined;
  EmployeeRegistration: undefined;
  SearchProduct: undefined;
  Managerscreen: undefined; 
  OrderDetails: { orderId?: number };
  ApprovalOrder: { orderId: number };
  ConfirmOrder: { 
    orderDetails: OrderProductDetails[];
    orderId: number;
  };
};