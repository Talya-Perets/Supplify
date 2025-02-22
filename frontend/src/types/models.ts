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