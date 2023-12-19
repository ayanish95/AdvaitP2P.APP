import { Country } from "./country";
import { States } from "./states";

export interface Company {
    Id: number;
    CompanyCode?: string;
    CompanyName?: string;
    Street1?: string;
    Street2?: string;
    Street3?: string;
    City?: string;
    StateId?: string;
    PostalCode?: string;
    Country?: Country;
    CountryCode?: string;
    State?: States;
    StateCode?: string;
    Telephone?: string;
    Email?: string;
    Language?: string;
    ParentCompany?: string;
    ChartOfAccount?: string;
    IsActive?: boolean;
    CreatedBy?: string;
    CreatedOn?: Date;
    UpdatedBy?: string;
    UpdatedOn?: Date;
    IsDeleted?: boolean;
    DeletedOn?: Date;
}