export type ICustomer = {
    CusCode: string;
    CustomerName: string;
    ArabicName: string;
    Mobile: string;
    AgentName: string;
    Address: string;
    City: string;
    Country: string;
    TelNo: string;
};
export type ISuppplier = {
    SupCode: string;
    SupplierName: string;
    ArabicName: string;
    ContactPerson: string;
    TelNo: string;
    Fax: string;
    VatNo: string;
    City: string;
};
export type ITransporter = {
    TrsCode: string;
    Transporter: string;
    ContactPerson: string;
    TelNo: string;
    MblNo: string;
    Fax: string;
    Email: string;
    City: string;
};
export type IDriver = {
    DriverNo: string;
    DriverId: string;
    DriverName: string;
    CompanyName: string;
};
export type IRate = {
    RtCode: string;
    CustomerID: number;
    ServiceID: number;
    ItemID: number;
    UnitID: number;
    Rate:number;
    Fdays:number;
    Vat:boolean;
    VatPercentage:number;

};
export type IItem = {
    ItmCode: string;
    ItmDes: string;
};
export type ITruck = {
    TruckNo: string;
    DriverId: string;
    DriverName: string;
    MblNo: string;
    TransporterId: number;
  }
export type IBranch = {
    code: string;
    branchName: string;
    branchIncharge: string;
    mobile: string;
    city: string;
  };