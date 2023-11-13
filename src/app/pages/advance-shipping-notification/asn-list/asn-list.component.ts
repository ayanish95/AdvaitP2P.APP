import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { Filter, OrderBy } from '@core/models/base-filter';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { ApprovalStrategyService } from '@core/services/approval-strategy.service';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AdvanceShippingNotificationService } from './../../../core/services/advance-shipment-notification.service';
import { PurchaseOrderHeader } from '@core/models/purchase-order';

@Component({
  selector: 'app-asn-list',
  templateUrl: './asn-list.component.html',
  styleUrls: ['./asn-list.component.scss']
})
export class AsnListComponent implements OnInit{
 
  ASNList!: PurchaseOrderHeader[];
  pendingASNList!: PurchaseOrderHeader[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  isSAPEnabled!: string;
  selectedPRId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!:number;
  rightsForApproval = false;

  constructor(private purchaseOrderService: PurchaseOrderService,private advanceShippingNotificationService: AdvanceShippingNotificationService, private toaster: ToastrService, private authService: AuthService, private dialog: MatDialog,private strategyService:ApprovalStrategyService) { }

  ngOnInit() {    
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable(); 
    this.apiASNList();  
    this.apiAllPendingList(); 
  }

  searchSupplier(filterValue: any) {
    filterValue = filterValue.target.value;
  }

  apiASNList() {
    this.purchaseOrderService
      .getAllApprovedPOHeaderListByUserId()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {          
          this.ASNList = res[ResultEnum.Model];
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }

  apiAllPendingList(){
    this.purchaseOrderService
    .getPendingASNByUserId()
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      if (res[ResultEnum.IsSuccess]) {        
        this.pendingASNList = res[ResultEnum.Model];
      }
      else {
        this.toaster.error(res[ResultEnum.Message]);
      }
    });
  }

  onTabChanged(event: any) {
    if (event?.index==1) {
      this.apiASNList();
    }
    else if(event.index==0){
      this.apiAllPendingList();
    }
  }

}
