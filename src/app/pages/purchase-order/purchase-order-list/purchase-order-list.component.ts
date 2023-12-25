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
import { PurchaseOrderVM } from '@core/models/purchase-order';
import { ApprovalStrategyService } from '@core/services/approval-strategy.service';
import { PurchaseOrderService } from '@core/services/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent {

  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'PONumber',
    'PODate',
    'PRNumber',
    'DocType',
    'Supplier',
    'TotalPOAmount',
    'Edit',
    'Delete',
    'View',
    'AddASN'



  ];

  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  POHeaderList!: PurchaseOrderVM[];
  pendingPOHeaderList!: PurchaseOrderVM[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  isSAPEnabled!: string;
  selectedPOId!: number;
  currentUserRole!: number;
  Role = Role;
  currentUserId!: number;
  rightsForApproval = false;
  propChanges: any;
  approvalStrategyList!: ApprovalStrategy[];

  constructor(private purchaseOrderService:PurchaseOrderService,private toaster:ToastrService,private authService: AuthService,private dialog: MatDialog, private strategyService:ApprovalStrategyService) {}

  ngOnInit() {
    this.currentUserRole = this.authService.roles();
    this.currentUserId = this.authService.userId();
    this.isSAPEnabled = this.authService.isSAPEnable();
   
    if (this.isSAPEnabled == 'false')
      this.displayedColumns = this.displayedColumns.filter(x => x != 'ERPPRNumber' && x != 'SAPStatus');

    this.apiPurchaseOder();
    this.apiApprovalStrategyByApprovalType();
  }

 // api for get all list who have rights for approve supplier and based on that show approve and reject button
 apiApprovalStrategyByApprovalType() {
  this.strategyService
    .getApprovalStrategyByApprovalType(ApprovalTypeEnum.PO)
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

apiAllPendingList(){
  this.purchaseOrderService
  .getPendingPOByUserId()
  .pipe(
    finalize(() => {
    })
  )
  .subscribe(res => {
    if (res[ResultEnum.IsSuccess]) {
      this.pendingPOHeaderList = res[ResultEnum.Model];
    }
    else {
      this.toaster.error(res[ResultEnum.Message]);
    }
  });
}

  apiPurchaseOder(){
    this.purchaseOrderService
    .getAllPOHeaderListByUserId()
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      if (res[ResultEnum.IsSuccess]) {
        this.POHeaderList = res[ResultEnum.Model];
        this.dataSource.data = this.POHeaderList;
        this.dataSource.paginator = this.paginator;
        this.filter = new Filter();
        this.filter.OrderBy = OrderBy.DESC;
        this.filter.OrderByColumn = 'id';
        this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
      }
      else
      this.toaster.error(res[ResultEnum.Message]);
    });
  }

  onTabChanged(event: any) {
    if (event?.index==0) {
      this.apiPurchaseOder();
    }
    else if(event.index==1){
      this.apiAllPendingList();
    }
  }

  searchSupplier(filterValue: any) {
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

  openDeleteModel(templateRef: TemplateRef<any>, plantId: number) {
    this.selectedPOId = plantId;
    this.dialog.open(templateRef);
  }

  onClickDeletePO(){
    if (this.selectedPOId == 0 || this.selectedPOId == undefined)
    throw this.toaster.error('Something went wrong');
  this.purchaseOrderService
    .deletePO(this.selectedPOId)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      if (res[ResultEnum.IsSuccess]) {
        this.toaster.success(res[ResultEnum.Message]);
        this.apiPurchaseOder();
        this.selectedPOId = 0;
      }
      else
        this.toaster.error(res[ResultEnum.Message]);

      this.dialog.closeAll();
    });
  }
}
