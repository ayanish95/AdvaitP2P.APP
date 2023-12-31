export interface Suppliers {
    Id?: number;
    SupplierCode?: string,
    FirstName?: string;
    LastName?: string;
    AccountGroup?: string;
    ShortName?: string;
    GSTNumber?: string;
    GSTRegionCode?: string;
    PANNumber?: string;
    TaxNumber?: string;
    ProductGroupId?:number[];
    SupplierType?:string;
    Street1?: string;
    Street2?: string;
    PostalCode?: string;
    City?: string;
    State?: string;
    Country?: string;
    Currency?: string;
    Language?: string;
    IsRejected?:boolean;
    RejectedDate?:Date;
    Phone?: string;
    Email?: string;
    BankCountry?:string;
    IFSCCode?:string;
    SwiftCode?:string;
    BankName?:string;
    AccountNumber?:any;
    AccountHolderName?:string;
    PayTermsCode?: string;
    BPCategoryId?:string;
    BussinessPartne?:string;
    Grouping?:string;
    SchemaGroup?:string;
    ReconcAccount?:string;
    PurchaseOrg?: string;
    GSTVendorClass?: string;
    CompanyCode?: string;
    IsActive?: boolean;
    CreatedBy?: string;
    CreatedOn?: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
    IsDeleted?: boolean;
    DeletedOn?: Date;
    Remarks?: string;
    ERPStatus?: boolean;
    Extra1?: string;
    Extra2?: string;
    ApproverId?: number;
    ApprovalPendingFrom?: string;
}
