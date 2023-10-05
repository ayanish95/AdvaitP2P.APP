export enum Role {
    Admin = 1,
    Dealer = 2,
    Distributor = 3,
    TSE = 4,
    ZH = 5,
    BH = 6,
    CustomerSalesSupport = 7,
    IndiaHead = 8,
    Snop = 9
}

export class UserRole {
    Id: number | undefined;
    Name: string | undefined;
}

export class RoleName {
    static Admin = 'Admin';
    static BranchHead = 'Branch Head';
    static CustomerSalesSupport = 'Customer Sales Support';
    static Dealer = 'Dealer';
    static Distributor = 'Distributor';
    static TerritorySalesExecutive = 'Territory Sales Executive';
    static ZonalHead = 'Zonal Head';
    static IndiaHead  = 'India Head';
    static Snop  = 'S&OP';
}