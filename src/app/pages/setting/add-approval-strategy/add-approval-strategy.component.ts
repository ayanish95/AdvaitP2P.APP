import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ApprovalStrategy, ApprovalTypes } from '@core/models/approval-type';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Country } from '@core/models/country';
import { DocTypes } from '@core/models/doc-type';
import { Plants } from '@core/models/plants';
import { States } from '@core/models/states';
import { ApprovalTypeService } from '@core/services/approval-type.service';
import { DocTypeService } from '@core/services/doc-type.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';
import { Location } from '@angular/common';
import { RoleService } from '@core/services/role.service';
import { Roles } from '@core/models/roles';
import { UserService } from '@core/services/user.service';
import { Users } from '@core/models/users';
import { AuthService } from '@core';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalStrategyService } from '@core/services/approval-strategy.service';

@Component({
  selector: 'app-add-approval-strategy',
  templateUrl: './add-approval-strategy.component.html',
  styleUrls: ['./add-approval-strategy.component.scss']
})
export class AddApprovalStrategyComponent implements OnInit {
  approvalFor = [
    { id: 'Supplier', name: 'Supplier' },
    { id: 'PR', name: 'Purchase Requistion' },
    { id: 'PO', name: 'Purchase Order' }
  ];
  displayedColumns: string[] = [
    'srNo',
    'ApprovalType',
    'ConfigurationFor',
    'Sequence',
    'Role',
    'Approver',
    'Edit',
    'Delete',
  ];
  filteredApprovalType!: Observable<any[]>;
  dataSource = new MatTableDataSource<any>();
  currentPage = 1;
  pageSize = 10;
  approvalTypDetail!: ApprovalTypes;
  approvalDetailsList!: ApprovalStrategy[];
  docTypeList!: DocTypes[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  filteredDocType!: Observable<any>;
  roleList!: Roles[];
  filteredRoles!: Observable<Roles[]>;
  userList!: Users[];
  filteredUser!: Observable<Users[]>;

  userListForItem!: Users[];
  filteredUserForItem!: Observable<Users[]>;
  selectedIdATId!: number;
  IsSAPEnable = false;
  approvalItems: ApprovalStrategy[] = [];
  selectedRole: any;
  selectedApprover: any;
  selectedSequence!: number;
  configForm = this.fb.group({
    ApprovalType: [null, [Validators.required]],
    DisplayText: ['', [Validators.required]],
    Sequence: [0, [Validators.required]],
    Role: ['' as any, [Validators.required]],
    User: ['' as any, [Validators.required]],
  });

  configEditForm = this.fb.group({
    Sequence: ['', [Validators.required]],
    Role: ['', [Validators.required]],
    User: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private location: Location, private router: Router, private roleService: RoleService, private authService: AuthService,
    private toaster: ToastrService, private approvalTypeService: ApprovalTypeService, private approvalStrategyService: ApprovalStrategyService, private route: ActivatedRoute, private userService: UserService, private dialog: MatDialog,) {

    this.route.queryParams.subscribe((params: any) => {
      this.selectedIdATId = params.atid;
    });
  }

  ngOnInit() {
    this.IsSAPEnable = this.authService.isSAPEnable() == 'true' ? true : false;
    this.roleList = [];
    this.apiRoleList();
    // this.apiUsersList();
    if (this.selectedIdATId && this.selectedIdATId > 0)
      this.apiApprovalStrategyDetailsById();

    this.filteredApprovalType = this.configForm.get('ApprovalType')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterApprovalType(value || ''))
    );
    this.configForm.get('Sequence')?.setValue(this.approvalItems?.length + 1);
  }

  apiApprovalStrategyDetailsById() {
    this.approvalStrategyService
      .getStrategyDetailsByApprovalTypeId(this.selectedIdATId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {

        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.approvalDetailsList = res[ResultEnum.Model];
            if (this.approvalDetailsList?.length > 0) {
              this.configForm.patchValue({
                ApprovalType: this.approvalFor?.find(x => x.id == this.approvalDetailsList[0]?.ApprovalType) as any,
                DisplayText: this.approvalDetailsList[0]?.ConfigurationFor,
                Sequence: this.approvalDetailsList?.length + 1
              });
              this.approvalDetailsList?.forEach(item => {
                this.approvalItems.push({
                  Id: item?.Id,
                  ApprovalType: this.approvalFor?.find(x => x.id == item?.ApprovalType) as any,
                  ConfigurationFor: item?.ConfigurationFor as any,
                  Sequence: item?.Sequence as any,
                  Role: item?.Role as any,
                  RoleId: item?.RoleId as any,
                  User: item?.User as any,
                  UserId: item?.User?.Id as any,
                  IsEdit: false
                });
              });

              this.dataSource.data = this.approvalItems;
            }
            else {
              this.apiApprovalTypeById();
            }
          }
          else
            this.toaster.error('Data Not Found');
        }
        else {
          this.toaster.error(res.Message);
        }
      });
  }
  apiApprovalTypeById() {
    this.approvalTypeService.getApprovalTypeDetailsById(this.selectedIdATId)
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.approvalTypDetail = res[ResultEnum.Model];
          if (this.approvalTypDetail) {
            this.configForm.patchValue({
              ApprovalType: this.approvalFor?.find(x => x.id == this.approvalTypDetail?.Type) as any,
              DisplayText: this.approvalTypDetail?.DisplayText,
              Sequence: 1
            });
          }
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
  }

  apiRoleList() {
    this.roleService.getAllRoleList()
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.roleList = res[ResultEnum.Model];
          this.filteredRoles = this.configForm.get('Role')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterRoles(value || ''))
          );
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
  }

  apiUsersList(roleId: number, IsForItem = false) {
    this.userList = [];
    this.userService.getUserListByRole(roleId)
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.userList = res[ResultEnum.Model];
          if (this.userList?.length > 0) {
            if (!IsForItem) {
              this.filteredUser = this.configForm.get('User')!.valueChanges.pipe(
                startWith(''),
                map(value => this.filterUsers(value || ''))
              );
            }
            else {
              this.filteredUserForItem = this.configEditForm.get('User')!.valueChanges.pipe(
                startWith(''),
                map(value => this.filterItemUsers(value || ''))
              );
            }
          }
          else {
            this.userList = [];
            if (!IsForItem) {
              this.filteredUser = this.configForm.get('User')!.valueChanges.pipe(
                startWith(''),
                map(value => this.filterUsers(value || ''))
              );
            }
            else {
              this.filteredUserForItem = this.configEditForm.get('User')!.valueChanges.pipe(
                startWith(''),
                map(value => this.filterItemUsers(value || ''))
              );
            }
            this.toaster.error(res[ResultEnum.Message]);
          }

        }
        else {
          this.userList = [];
          if (!IsForItem) {
            this.filteredUser = this.configForm.get('User')!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterUsers(value || ''))
            );
          }
          else {
            this.filteredUserForItem = this.configEditForm.get('User')!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterItemUsers(value || ''))
            );
          }
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
  }

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

  filterRoles(name: any) {
    if (name?.RoleName) {
      return this.roleList?.filter(role =>
        role?.RoleName?.toLowerCase().includes(name.RoleName.toLowerCase()));
    }
    else {
      return this.roleList?.filter(role =>
        role?.RoleName?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  filterUsers(name: any) {
    if (this.IsSAPEnable) {
      if (name?.ERPUserId) {
        return this.userList?.filter(role =>
          role?.FirstName?.toLowerCase().includes(name.FirstName.toLowerCase()) ||
          role?.LastName?.toLowerCase().includes(name.LastName.toLowerCase()) ||
          role?.ERPUserId?.toLowerCase().includes(name.ERPUserId.toLowerCase()));
      }
      else {
        return this.userList?.filter(role =>
          role?.FirstName?.toLowerCase().includes(name.toLowerCase()) ||
          role?.LastName?.toLowerCase().includes(name.toLowerCase()) ||
          role?.ERPUserId?.toLowerCase().includes(name.toLowerCase()));
      }
    }
    else {
      if (name?.Id) {
        return this.userList?.filter(role =>
          role?.FirstName?.toLowerCase().includes(name.FirstName.toLowerCase()) ||
          role?.LastName?.toLowerCase().includes(name.LastName.toLowerCase()) ||
          role?.Id == name.Id);
      }
      else {
        return this.userList?.filter(role =>
          role?.FirstName?.toLowerCase().includes(name.toLowerCase()) ||
          role?.LastName?.toLowerCase().includes(name.toLowerCase()) ||
          role?.Id == name.Id);
      }
    }
  }


  filterItemUsers(name: any) {
    if (this.IsSAPEnable) {
      if (name?.ERPUserId) {
        return this.userList?.filter(role =>
          role?.FirstName?.toLowerCase().includes(name.FirstName.toLowerCase()) ||
          role?.LastName?.toLowerCase().includes(name.LastName.toLowerCase()) ||
          role?.ERPUserId?.toLowerCase().includes(name.ERPUserId.toLowerCase()));
      }
      else {
        return this.userList?.filter(role =>
          role?.FirstName?.toLowerCase().includes(name.toLowerCase()) ||
          role?.LastName?.toLowerCase().includes(name.toLowerCase()) ||
          role?.ERPUserId?.toLowerCase().includes(name.toLowerCase()));
      }
    }
    else {
      if (name?.Id) {
        return this.userList?.filter(role =>
          role?.FirstName?.toLowerCase().includes(name.FirstName.toLowerCase()) ||
          role?.LastName?.toLowerCase().includes(name.LastName.toLowerCase()) ||
          role?.Id == name.Id);
      }
      else {
        return this.userList?.filter(role =>
          role?.FirstName?.toLowerCase().includes(name.toLowerCase()) ||
          role?.LastName?.toLowerCase().includes(name.toLowerCase()) ||
          role?.Id == name.Id);
      }
    }
  }

  roleDisplayFn(role: Roles) {
    return role ? role.RoleName! : '';
  }
  approvalTypeDisplayFn(approvalFor: any) {
    return approvalFor ? approvalFor.name! : '';
  }

  userDisplayFn(user: Users) {
    if (this.IsSAPEnable) {
      return user ? user.ERPUserId + ' - ' + user?.FirstName + ' ' + user?.LastName! : '';
    }
    else
      return user ? user.Id + ' - ' + user?.FirstName + ' ' + user?.LastName! : '';
  }

  onChangeRole(event: any) {
    this.configForm.get('User')?.setValue(null);
    const roleId = event?.option.value?.Id;
    this.apiUsersList(roleId);
  }
  onChangeItemRole(event: any) {
    this.configEditForm.get('User')?.setValue(null);
    const roleId = event?.option.value?.Id;
    this.apiUsersList(roleId, true);
  }

  onKeyPress(evt: any) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  onChangeSequence(event: any) {
    if (this.approvalItems?.filter(x => x.Sequence == event?.target?.value)?.length > 0)
      return this.toaster.error('Strategy already exist for sequence ' + event?.target?.value);
    else
      return;
  }

  onClickAddItem() {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
    const lineItem = this.configForm.value;

    if (this.approvalItems.filter(x => x.Role?.Id == lineItem.Role?.Id && x.User?.Id == lineItem.User?.Id)?.length > 0)
      throw this.toaster.error('Role and approver already exist for other sequence.');

    const sequence = lineItem?.Sequence;
    // if (this.approvalItems?.filter(x => x.Sequence == sequence)?.length > 0)
    //   throw this.toaster.error('Strategy already exist for sequence ' + lineItem?.Sequence);
    this.approvalItems.push({
      Id: 0,
      ApprovalType: lineItem.ApprovalType as any,
      ConfigurationFor: lineItem.DisplayText as any,
      Sequence: lineItem.Sequence as any,
      Role: lineItem.Role as any,
      User: lineItem.User as any,
      IsEdit: false
    });
    this.dataSource.data = this.approvalItems;
    this.configForm.get('Sequence')?.setValue(this.approvalItems?.length + 1);
    this.configForm.get('Role')?.setValue('');
    this.configForm.get('User')?.setValue('');
    this.configForm.markAsUntouched();
  }

  onClickUpdateItem() {
    const updatedData = this.configEditForm.value;
    this.approvalItems.filter(x => x.Sequence == updatedData.Sequence).map(x => {
      x.Role = updatedData.Role as any,
        x.User = updatedData.User as any;
    });
    this.dataSource.data = this.approvalItems;
  }

  openDeleteModel(templateRef: TemplateRef<any>, sequence: number) {
    this.selectedSequence = sequence;
    this.dialog.open(templateRef);
  }

  onClickDeleteItem() {
    if (!this.selectedSequence)
      throw this.toaster.error('Something went wrong...');
    this.dialog.closeAll();
    const data = this.approvalItems.find(x => x.Sequence == this.selectedSequence);
    this.approvalItems = this.approvalItems.filter(x => x.Sequence != this.selectedSequence);
    this.approvalItems.forEach((element, index) => {
      return element.Sequence = index + 1;
    });
    this.dataSource.data = this.approvalItems;
  }

  editApprovalItem(templateRef: TemplateRef<any>, sequence: any) {
    const data = this.approvalItems.find(x => x.Sequence == sequence);
    this.configEditForm.patchValue({
      Sequence: sequence,
      Role: data?.Role,
      User: data?.User as any
    });
    this.apiUsersList(data?.Role?.Id, true);
    this.dialog.open(templateRef);
  }

  onClickAddAprovalConfig() {
    if (this.approvalItems.length <= 0)
      throw this.toaster.error('Please add atleast one strategy...');

    const strategyList: ApprovalStrategy[] = [];

    this.approvalItems.forEach(approval => {
      strategyList.push({
        Id: 0,
        ApprovalType: approval.ApprovalType?.id,
        ApprovalTypeId: this.selectedIdATId,
        Sequence: approval.Sequence,
        Role: approval.Role,
        RoleId: approval.Role?.Id,
        User: approval.User,
        UserId: approval.User?.Id
      });
    });
    if (!this.selectedIdATId) {
      this.approvalStrategyService.addApprovalStrategy(strategyList).subscribe({
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
      this.approvalStrategyService.addApprovalStrategy(strategyList).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.configForm.reset();
            this.selectedIdATId = 0;
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

  onClickBack() {
    this.location.back();
  }
}

