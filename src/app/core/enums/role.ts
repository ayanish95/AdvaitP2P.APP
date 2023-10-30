export enum Role {
    Admin = 1,
    ProcurementTeam = 2,
    CommercialTeam = 3,
    FinanceTeam = 4,
    MasterUser = 5,
    Supplier = 6,
    WarehouseTeam = 7,
    UserTeam = 8
}

export class UserRole {
    Id: number | undefined;
    Name: string | undefined;
}

export class RoleName {
    static Admin = 'Admin';
    static ProcurementTeam = 'Procurement Team';
    static CommercialTeam = 'CommercialTeam';
    static FinanceTeam = 'Finance Team';
    static MasterUser = 'Master User';
    static Supplier = 'Supplier';
    static WarehouseTeam = 'Warehouse Team';
    static UserTeam  = 'User Team';
}