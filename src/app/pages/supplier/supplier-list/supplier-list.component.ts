import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Suppliers } from '@core/models/suppliers';
import { Users } from '@core/models/users';
import { SupplierService } from '@core/services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AddSupplierForAdminComponent } from '../add-supplier-for-admin/add-supplier-for-admin.component';
import { AuthService } from '@core';
import { Role } from '@core/enums/role';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent implements OnInit {

  searchText!: string;
  allSuppliierList!: Suppliers[];
  pendingSuppliierList!: Suppliers[];
  approveSuppliierList!: Suppliers[];
  userRole!:number;
  Role = Role;

  constructor(private supplierService: SupplierService, private toast: ToastrService,private dialog: MatDialog,private authService:AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.roles();
    this.apiAllSupplierList();
  }

  apiAllSupplierList(){
    this.supplierService
    .getSupplierList()
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      if (res[ResultEnum.IsSuccess]) {
        this.allSuppliierList = res[ResultEnum.Model];
      }
      else {
        this.toast.error(res[ResultEnum.Message]);
      }
    });
  }

  apiAllPendingList(){
    this.supplierService
    .getSupplierList(false)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      if (res[ResultEnum.IsSuccess]) {
        this.pendingSuppliierList = res[ResultEnum.Model];
      }
      else {
        this.toast.error(res[ResultEnum.Message]);
      }
    });
  }

  searchSupplier(filterValue: any) {
    this.searchText = filterValue.target.value;
  }
  onTabChanged(event: any) {
    if (event?.index==0) {
      this.apiAllSupplierList();
    }
    else if(event.index==1){
      this.apiAllPendingList();
    }
    else{
      this.supplierService
      .getSupplierList(true)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.approveSuppliierList = res[ResultEnum.Model];
        }
        else {
          this.toast.error(res[ResultEnum.Message]);
        }
      });
    }
  }

  onClickAddSupplier(){
    const dialogRef = this.dialog.open(AddSupplierForAdminComponent, {
      width: '60vw',
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      this.apiAllSupplierList();
    });
  }
}
