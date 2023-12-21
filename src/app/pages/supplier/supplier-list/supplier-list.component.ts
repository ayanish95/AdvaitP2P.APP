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
import { filter, finalize } from 'rxjs';
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
  rejectsuplierlist!: Suppliers[];

  userRole!: number;
  Role = Role;

  constructor(private supplierService: SupplierService, private toast: ToastrService, private dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.roles();
    this.apiAllSupplierList();
  }

  // API Sync Supplier From SAP
  onClickSyncSupplierFromSAP() {
    this.supplierService
      .syncSupplierFromSAP().subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toast.success(res[ResultEnum.Message]);
            this.apiAllSupplierList();
          }
          else {
            this.toast.error(res[ResultEnum.Message]);
          }
        },
        error: (e) => { this.toast.error(e.Message); }
      });
  }

  // API for get all supplier list
  apiAllSupplierList() {
    this.supplierService
      .getSupplierList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.allSuppliierList = res[ResultEnum.Model];
          this.rejectsuplierlist = this.allSuppliierList.filter(x => x.IsRejected == true);
          console.log(this.rejectsuplierlist);


        }
        else {
          this.toast.error(res[ResultEnum.Message]);
        }
      });
  }

  // API for get all pending supplier list
  apiAllPendingList() {
    this.supplierService
      .getSupplierList(false)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.pendingSuppliierList = res[ResultEnum.Model];
          this.pendingSuppliierList = this.pendingSuppliierList.filter(x => x.IsRejected == false);
        }
        else {
          this.toast.error(res[ResultEnum.Message]);
        }
      });
  }

  // Search supplier
  searchSupplier(filterValue: any) {
    this.searchText = filterValue.target.value;
  }

  //On tab change event
  onTabChanged(event: any) {
    if (event?.index == 0) {
      this.apiAllSupplierList();
    }
    else if (event.index == 1) {
      this.apiAllPendingList();
    }
    else {
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

  // Open modal popup for add supplier and call add supplier API
  onClickAddSupplier() {
    const dialogRef = this.dialog.open(AddSupplierForAdminComponent, {
      width: '60vw',
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.apiAllSupplierList();
    });
  }
}
