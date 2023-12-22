import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@core';
import { ApprovalTypeEnum } from '@core/enums/approval-type-enum';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { ApprovalStrategy } from '@core/models/approval-type';
import { Filter, OrderBy } from '@core/models/base-filter';
import { PurchaseRequisitionHeader } from '@core/models/purchase-requistion';
import { ApprovalStrategyService } from '@core/services/approval-strategy.service';
import { PurchaseRequistionService } from '@core/services/purchase-requistion.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-purchase-requisition-list',
  templateUrl: './purchase-requisition-list.component.html',
  styleUrls: ['./purchase-requisition-list.component.scss']
})
export class PurchaseRequisitionListComponent implements OnInit {

  PRHeaderList!: PurchaseRequisitionHeader[];
  pendingPRHeaderList!: PurchaseRequisitionHeader[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  isSAPEnabled!: string;
  selectedPRId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  approvalStrategyList!: ApprovalStrategy[];
  rightsForApproval = false;
  constructor(private purchaseRequistionService: PurchaseRequistionService, private toaster: ToastrService, private authService: AuthService, private dialog: MatDialog, private strategyService: ApprovalStrategyService) { }

  ngOnInit() {
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();
    this.apiPRList();
    this.apiApprovalStrategyByApprovalType();
  }

  apiPRList() {
    this.purchaseRequistionService
      .getAllPRHeaderListByUserId()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.PRHeaderList = res[ResultEnum.Model];
        }
        else {
          this.PRHeaderList = [];
          this.toaster.info(res[ResultEnum.Message]);
        }
      });
  }

  apiAllPendingList() {
    this.purchaseRequistionService
      .getPendingPRByUserId()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.pendingPRHeaderList = res[ResultEnum.Model];
        }
        else {
          this.pendingPRHeaderList = [];
          this.toaster.info(res[ResultEnum.Message]);
        }
      });
  }


  // api for get all list who have rights for approve supplier and based on that show approve and reject button
  apiApprovalStrategyByApprovalType() {
    this.strategyService
      .getApprovalStrategyByApprovalType(ApprovalTypeEnum.PR)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.approvalStrategyList = res[ResultEnum.Model];

          // Condition - Here is the check the current user have rights for approve the supplier, If yes then it've show the approve and reject button otherwise it will disappear for the user
          if (this.currentUserRole != Role.Admin)
            this.rightsForApproval = this.approvalStrategyList.filter(x => x.UserId == this.currentUserId)?.length > 0 ? true : false;
          else
            this.rightsForApproval = true;
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
  }

  searchSupplier(filterValue: any) {
    filterValue = filterValue.target.value;
  }

  onTabChanged(event: any) {
    if (event?.index == 0) {
      this.apiPRList();
    }
    else if (event.index == 1) {
      this.apiAllPendingList();
    }
  }
}
