import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Company } from '@core/models/company';
import { Plants } from '@core/models/plants';
import { CompanyService } from '@core/services/company.service';
import { PlantService } from '@core/services/plant.service';
import { ToastrService } from 'ngx-toastr';
import { AddCompanyComponent } from '../add-company/add-company.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent {
  displayedColumns: string[] = [
    'srNo',
    'CompanyCode',
    'CompanyName',
    'Street1',
    'Country',
    'City',
    'PostalCode',
    'Telephone',
    'Email',
    'IsActive',
    'Actions',
    // 'View',
    // 'Edit',
    // 'Delete',
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  companyList!: Company[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  isEdit = false;
  selectedPlantId!: number;
  plantDetails!: Plants;
  Role = Role;

  constructor(private plantService: PlantService, private dialog: MatDialog,
    private toaster: ToastrService, private companyService: CompanyService) { }

  ngOnInit() {
    this.apiCompanyList();
  }

  apiCompanyList() {
    this.companyService
      .getCompanyList().subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.companyList = res[ResultEnum.Model];
            this.dataSource.data = this.companyList;
            this.dataSource.paginator = this.paginator;
            this.filter = new Filter();
            this.filter.OrderBy = OrderBy.DESC;
            this.filter.OrderByColumn = 'id';
            this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
          }
        }
      });
  }
  searchCompany(filterValue: any) {
    filterValue = filterValue.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageChange(page: PageEvent) {
    this.index = page.pageIndex * page.pageSize;
    this.filter.PageSize = page.pageSize;
    this.filter.Page = page.pageIndex + 1;
  }

  openModelAddCompany() {
    this.isEdit = false;
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('company data', result);
      if (result != '' && result != undefined && result?.data) {
        this.apiAddCompany(result.data);
      }
    });
  }

  openEditModelPopup(companyId: number) {
    this.isEdit = true;
    this.selectedPlantId = companyId;
    this.companyService
      .getCompanyDetailsById(companyId).subscribe(async res => {
        if (res[ResultEnum.IsSuccess]) {
          console.log('company details',res);
          
          this.plantDetails = res[ResultEnum.Model];
          if (this.plantDetails) {

            this.dialog.open(AddCompanyComponent, {
              width: '56vw',
              panelClass: 'custom-modalbox'
            });
          }
          else {
            this.toaster.error('User not found');
          }
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
   
  }

  openDeleteModel(templateRef: TemplateRef<any>, plantId: number) {
    this.selectedPlantId = plantId;
    this.dialog.open(templateRef);
  }

  apiAddCompany(company: Company) {
    debugger
    const companyData = {
      Id: this.isEdit ? this.selectedPlantId : 0,
      CompanyCode: '',
      CompanyName: company.CompanyName,
      Street1: company.Street1,
      Street2: company.Street2,
      Street3: company.Street3,
      City: company.City,
      PostalCode: company.PostalCode,
      StateCode: company.StateCode,
      CountryCode: company.CountryCode,
      Email: company.Email,
      Telephone: company.Telephone,
      IsActive: this.isEdit ? company.IsActive : true,
    } as Company;

    if (!this.isEdit) {
      this.companyService.addCompany(companyData).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.apiCompanyList();
          }
          else {
            this.toaster.error(res.Message);
          }
        },
        error: (e) => { this.toaster.error(e.Message); },
        complete() {

        },
      });
    }
  }

  onClickAddPlant() {
    let plantdata: any;
    const plant = {
      Id: this.isEdit ? this.selectedPlantId : 0,
      PlantCode: '',
      PlantName: plantdata.PlantName,
      Email: plantdata.Email,
      Mobile: plantdata.Mobile,
      Street1: plantdata.Street1,
      Street2: plantdata.Street2,
      Country: plantdata.Country?.CountryCode,
      // StateId: this.isSAPEnabled == 'false' ? plantdata.State?.Id.toString() : plantdata.State?.GSTStateCode,
      GSTStateCode: plantdata.State?.GSTStateCode,
      City: plantdata.City,
      Pincode: plantdata.PostalCode,
      GST: plantdata.GSTNumber,
      TaxNumber: plantdata.TaxNumber,
      BusinessPlace: plantdata.BusinessPlace,
      CompanyCode: plantdata.CompanyCode,
      IsActive: this.isEdit ? plantdata.IsActive : true,
    } as Plants;

    if (!this.isEdit) {
      this.companyService.addCompany(plant).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.apiCompanyList();
          }
          else {
            this.toaster.error(res.Message);
          }
        },
        error: (e) => { this.toaster.error(e.Message); },
        complete() {

        },
      });
    }
    else {
      this.plantService.updatePlant(plant).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.apiCompanyList();
            this.selectedPlantId = 0;
          }
          else {
            this.toaster.error(res.Message);
          }
        },
        error: (e) => { this.toaster.error(e.Message); },
        complete() {

        },
      });
    }

  }

  onClickDeletePlant() {
    if (this.selectedPlantId == 0 || this.selectedPlantId == undefined)
      throw this.toaster.error('Something went wrong');
    this.plantService
      .deletePlant(this.selectedPlantId).subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res[ResultEnum.Message]);
          this.apiCompanyList();
          this.selectedPlantId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }
  IsActiveFlagUpdate(element: any, e: any) {
    element.IsActive = e.srcElement.checked;
    this.plantService.updatePlant(element)
      .subscribe(response => {
        console.log('Update successful', response);
      }, error => {
        console.error('Error updating', error);
      });
  }
}
