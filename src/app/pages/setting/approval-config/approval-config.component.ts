import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ApprovalTypes } from '@core/models/approval-type';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Plants } from '@core/models/plants';
import { ApprovalTypeService } from '@core/services/approval-type.service';
import { DocTypeService } from '@core/services/doc-type.service';
import { PlantService } from '@core/services/plant.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-approval-config',
  templateUrl: './approval-config.component.html',
  styleUrls: ['./approval-config.component.scss']
})
export class ApprovalConfigComponent implements OnInit {
// Component shows approval configuration lists
  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'ApprovalFor',
    'ApprovalType',
    'DocType',
    'Amount',
    'Edit',
    'Delete',
    'AddStrategy'
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  approvalTypeList!: ApprovalTypes[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  selectedPlantId!: number;
  plantDetails!: Plants;
  configForm = this.fb.group({
    ApprovalType: ['', [Validators.required]],
    ApprovalText: ['', [Validators.required]],
    DocType: [''],
    Amount: [''],
  });

  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private router: Router,
    private toaster: ToastrService, private docTypeService: DocTypeService, private approvalTypeService: ApprovalTypeService) { }

  ngOnInit() {
    this.apiApprovalTypeList();
  }

  // API call for approval type list
  apiApprovalTypeList() {
    this.approvalTypeService
      .getAllApprovalTypeList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.approvalTypeList = res[ResultEnum.Model];
          this.dataSource.data = this.approvalTypeList;
          this.dataSource.paginator = this.paginator;
          this.filter = new Filter();
          this.filter.OrderBy = OrderBy.DESC;
          this.filter.OrderByColumn = 'id';
          this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
        }
      });
  }
  //Saerch approval config
  searchApprovalConfig(filterValue: any) {
    filterValue = filterValue.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //On page change event for approval config pagination
  pageChange(page: PageEvent) {
    this.index = page.pageIndex * page.pageSize;
    this.filter.PageSize = page.pageSize;
    this.filter.Page = page.pageIndex + 1;
  }

  //Redirect for add config
  onClickAddConfig() {
    this.router.navigateByUrl('/config/approval-config/add-approval');
  }

  //Redirect for edit approval config
  openEditModelPopup(templateRef: TemplateRef<any>, plantId: number) {
    this.router.navigateByUrl('/config/approval-config/edit-approval');
  }

  //Open modal popup for delete approval config
  openDeleteModel(templateRef: TemplateRef<any>, plantId: number) {
    this.selectedPlantId = plantId;
    this.dialog.open(templateRef);
  }

  //API call delete approval config
  onClickDeleteApprovalConfig() {
    if (this.selectedPlantId == 0 || this.selectedPlantId == undefined)
      throw this.toaster.error('Something went wrong');
    this.approvalTypeService
      .deleteApprovalType(this.selectedPlantId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res[ResultEnum.Message]);
          this.apiApprovalTypeList();
          this.selectedPlantId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }
}
