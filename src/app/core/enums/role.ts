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
    static Admin: string = 'Admin';
    static BranchHead: string = 'Branch Head';
    static CustomerSalesSupport: string = 'Customer Sales Support';
    static Dealer: string = 'Dealer';
    static Distributor: string = 'Distributor';
    static TerritorySalesExecutive: string = 'Territory Sales Executive';
    static ZonalHead: string = 'Zonal Head';
    static IndiaHead : string = 'India Head';
    static Snop : string = 'S&OP';
}