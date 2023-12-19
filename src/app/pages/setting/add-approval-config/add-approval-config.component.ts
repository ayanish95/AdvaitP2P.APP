import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ApprovalTypes } from '@core/models/approval-type';
import { Filter } from '@core/models/base-filter';
import { DocTypes } from '@core/models/doc-type';
import { Plants } from '@core/models/plants';
import { ApprovalTypeService } from '@core/services/approval-type.service';
import { DocTypeService } from '@core/services/doc-type.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';
import { Location } from '@angular/common';
import { ApprovalTypeEnum } from '@core/enums/approval-type-enum';

@Component({
  selector: 'app-add-approval-config',
  templateUrl: './add-approval-config.component.html',
  styleUrls: ['./add-approval-config.component.scss']
})
export class AddApprovalConfigComponent implements OnInit {
  approvalFor = [
    { id: ApprovalTypeEnum.Supplier, name: 'Supplier' },
    { id: ApprovalTypeEnum.PR, name: 'Purchase Requistion' },
    { id: ApprovalTypeEnum.PO, name: 'Purchase Order' }
  ];
  filteredApprovalType!: Observable<any[]>;
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  plantList!: Plants[];
  approvalTypDetail!: ApprovalTypes;
  docTypeList!: DocTypes[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  filteredDocType!: Observable<any>;
  selectedId!: number;
  configForm = this.fb.group({
    ApprovalType: [null, [Validators.required]],
    ApprovalText: ['', [Validators.required]],
    DocType: [''],
    Amount: [],
  });

  constructor(private fb: FormBuilder, private location: Location, private router: Router,
    private toaster: ToastrService, private docTypeService: DocTypeService, private approvalTypeService: ApprovalTypeService, private route: ActivatedRoute) {

    //Get query param value
    this.route.queryParams.subscribe((params: any) => {
      this.selectedId = params.id;
    });
  }

  ngOnInit() {
    this.apiDocTypeList();
    if (this.selectedId && this.selectedId > 0)
      this.apiApprovalTypeDetailsById();

    this.filteredApprovalType = this.configForm.get('ApprovalType')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterApprovalType(value || ''))
    );
  }

  //API approval type details by ID
  apiApprovalTypeDetailsById() {
    this.approvalTypeService
      .getApprovalTypeDetailsById(this.selectedId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.approvalTypDetail = res[ResultEnum.Model];
            this.configForm.patchValue({
              ApprovalType: this.approvalFor?.find(x => x.id == this.approvalTypDetail.Type) as any,
              ApprovalText: this.approvalTypDetail.DisplayText,
              DocType: this.docTypeList.find(x => x.Type == this.approvalTypDetail?.DocType) as any,
              Amount: this.approvalTypDetail?.Amount as any
            });
          }
          else
            this.toaster.error('Data Not Found');
        }
        else {
          this.toaster.error(res.Message);
        }
      });
  }

  //API document type list
  apiDocTypeList() {
    this.docTypeService.getAllDocType()
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.docTypeList = res[ResultEnum.Model];
          this.filteredDocType = this.configForm.get('DocType')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterDocType(value || ''))
          );
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
  }

//Searcg document type
  filterDocType(name: any) {
    if (name?.Type) {
      return this.docTypeList?.filter(role =>
        role?.Type?.toLowerCase().includes(name.Type.toLowerCase()));
    }
    else {
      return this.docTypeList?.filter(role =>
        role?.Type?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  //Search approval type
  filterApprovalType(name: any) {
    if (name?.name) {
      return this.approvalFor?.filter(role =>
        role?.name?.toLowerCase().includes(name.name.toLowerCase()));
    }
    else {
      return this.approvalFor?.filter(role =>
        role?.name?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  //Display funcation document type
  docTypeDisplayFn(docType: DocTypes) {
    return docType ? docType.Type! : '';
  }
  approvalTypeDisplayFn(approvalFor: any) {
    return approvalFor ? approvalFor.name! : '';
  }

  //Click event for back button
  onClickBack() {
    this.location.back();
  }

  // On click approval config and API call for add and update
  onClickAddAprovalConfig() {
    this.configForm.markAllAsTouched();
    if (this.configForm.invalid)
      return;

    const configData = this.configForm.value as any;
    const config = {
      Id: this.selectedId ? this.selectedId : 0,
      Type: configData.ApprovalType?.id as any,
      DisplayText: configData.ApprovalText,
      DocType: configData.DocType?.Type as any,
      DocTypeId: configData.DocType?.Id as any,
      Amount: configData.Amount,
      IsActive: this.selectedId ? true : true,
    } as ApprovalTypes;

    if (!this.selectedId) {
      //Add approval config API call
      this.approvalTypeService.addApprovalType(config).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.configForm.reset();
            this.router.navigateByUrl('/config/approval-config');
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
      //Update approval confign API call
      this.approvalTypeService.updateApprovalType(config).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.configForm.reset();
            this.selectedId = 0;
            this.router.navigateByUrl('/config/approval-config');
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
}
