import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '@core';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { Filter } from '@core/models/base-filter';
import { ApprovalStrategyService } from '@core/services/approval-strategy.service';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import { AdvanceShippingNotificationService } from './../../../core/services/advance-shipment-notification.service';
import { PurchaseOrderVM } from '@core/models/purchase-order';
import { AdvancedShipmentNotificationVM } from '@core/models/advance-shipping-notification';

@Component({
  selector: 'app-asn-list',
  templateUrl: './asn-list.component.html',
  styleUrls: ['./asn-list.component.scss']
})
export class AsnListComponent implements OnInit {

  POList!: PurchaseOrderVM[];
  pendingASNList!: PurchaseOrderVM[];
  AsnallList!: AdvancedShipmentNotificationVM[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  selectedPRId!: number;
  filter: Filter = new Filter();
  index = 0;
  isSAPEnabled!: string;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  rightsForApproval = false;

  constructor(private purchaseOrderService: PurchaseOrderService, private advanceShippingNotificationService: AdvanceShippingNotificationService, private toaster: ToastrService, private authService: AuthService, private dialog: MatDialog, private strategyService: ApprovalStrategyService) { }

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
      .getAllApprovedPOHeaderListByUserId().subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.POList = res[ResultEnum.Model];
          }
          else {
            this.POList = [];
            this.toaster.error(res.Message);
          }
        },
        error: (e) => { this.toaster.error(e.Message); },
        complete() {

        },
      });
  }

  apiAllPendingList() {
    this.advanceShippingNotificationService.GetAllASNList().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.AsnallList = res[ResultEnum.Model];
        }
        else {
          this.AsnallList = [];
          this.toaster.error(res.Message);
        }
      },
      error: (e) => { this.toaster.error(e.Message); },
      complete() {

      },
    });
  }

  onTabChanged(event: any) {
    if (event?.index == 1) {
      this.apiAllPendingList();
    }
    else if (event.index == 0) {
      this.apiASNList();
    }
  }

}
