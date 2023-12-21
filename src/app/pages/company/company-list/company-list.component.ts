import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Company } from '@core/models/company';
import { CompanyService } from '@core/services/company.service';
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
    'City',
    'PostalCode',
    'Country',
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
  selectedCompanyId!: number;
  companyDetails!:Company;
  Role = Role;

  constructor(private dialog: MatDialog,
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
      if (result != '' && result != undefined && result?.data) {
        this.apiAddCompany(result.data);
      }
    });
  }

  openEditModelPopup(companyId: number) {
    if(!companyId)
    throw this.toaster.error('Company id is not found...');
    this.isEdit = true;
    this.selectedCompanyId = companyId;
    this.companyService
      .getCompanyDetailsById(companyId).subscribe(async res => {
        if (res[ResultEnum.IsSuccess]) {
          this.companyDetails = res[ResultEnum.Model];
          if (this.companyDetails) {
            this.isEdit=true;
            const dialogRef =  this.dialog.open(AddCompanyComponent, {
              width: '56vw',
              panelClass: 'custom-modalbox',
              data:{Company:this.companyDetails,IsEdit:true}
            });
            dialogRef.afterClosed().subscribe((result: any) => {
              if (result != '' && result != undefined && result?.data) {
                this.apiAddCompany(result.data);
              }
            });
          }
          else {
            this.toaster.error('Company details not found...');
          }
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
   
  }

  openDeleteModel(templateRef: TemplateRef<any>, companyId: number) {
    this.selectedCompanyId = companyId;
    this.dialog.open(templateRef);
  }

  apiAddCompany(company: Company) {
    const companyData = {
      Id: this.isEdit ? company.Id : 0,
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
      });
    }
    else{
      this.companyService.updateCompany(companyData).subscribe({
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
      });
    }
    this.isEdit=false;
  }

  onClickDeleteCompany() {
    if (this.selectedCompanyId == 0 || this.selectedCompanyId == undefined)
      throw this.toaster.error('Something went wrong');
    this.companyService
      .deleteCompany(this.selectedCompanyId).subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res[ResultEnum.Message]);
          this.apiCompanyList();
          this.selectedCompanyId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }
  IsActiveFlagUpdate(element: any, e: any) {
    element.IsActive = e.srcElement.checked;
    this.companyService.updateCompany(element).subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res.Message);
        }
        else {
          this.toaster.error(res.Message);
        }
      },
      error: (e) => { this.toaster.error(e.Message); },
    });
  }
}
