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