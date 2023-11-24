import { X } from '@angular/cdk/keycodes';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Roles } from '@core/models/roles';
import { Users, UsersVM } from '@core/models/users';
import { RoleService } from '@core/services/role.service';
import { UserService } from '@core/services/user.service';
import { TablesDataService } from 'app/routes/tables/data.service';
import { TablesKitchenSinkEditComponent } from 'app/routes/tables/kitchen-sink/edit/edit.component';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [TablesDataService, UserService],
})
export class UserListComponent {
  list: any[] = [];
  isLoading = true;
  displayedColumns: string[] = ['srNo', 'userName', 'name', 'roleName', 'erpUserId', 'email', 'mobile', 'isActive', 'edit', 'delete'];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  userList!: UsersVM[];
  userDetails!: UsersVM;
  roleList!: Roles[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  filteredRoles!: Observable<Roles[]>;
  selectedUserId = 0;
  userForm = this.fb.group({
    FirstName: ['', [Validators.required]],
    LastName: [''],
    UserName: [''],
    Role: ['', [Validators.required]],
    Email: ['', [Validators.required]],
    Mobile: ['', [Validators.required]],
  });
  editUserForm = this.fb.group({
    FirstName: ['', [Validators.required]],
    LastName: [''],
    UserName: [''],
    Role: ['', [Validators.required]],
    Email: ['', [Validators.required]],
    Mobile: ['', [Validators.required]],
    IsActive: [false]
  });

  constructor(
    private dataSrv: TablesDataService,
    private dialog: MatDialog,
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    this.selectedUserId = 0;
    this.apiUserList();

    this.roleService
      .getAllRoleList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.roleList = res[ResultEnum.Model];
          this.filteredRoles = this.userForm.get('Role')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterRoles(value || ''))
          );
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
    this.list = this.dataSrv.getData();
    this.isLoading = false;
  }

  filterRoles(name: any) {
    if (name?.DisplayName) {
      return this.roleList.filter(role =>
        role?.DisplayName?.toLowerCase().includes(name.DisplayName.toLowerCase()));
    }
    else {
      return this.roleList.filter(role =>
        role?.DisplayName?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  roleDisplayFn(role: Roles) {
    return role ? role.DisplayName! : '';
  }

  apiUserList() {
    this.userService
      .getUserList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.userList = res[ResultEnum.Model];
          this.dataSource.data = this.userList;
          this.dataSource1 = this.userList;
          this.dataSource.paginator = this.paginator;
          this.filter = new Filter();
          this.filter.OrderBy = OrderBy.DESC;
          this.filter.OrderByColumn = 'id';
          this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
        }
      });
  }


  searchUser(filterValue: any) {
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

  openModelAddUser(templateRef: TemplateRef<any>) {
    this.userForm.reset();
    this.userForm.updateValueAndValidity();
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  openModelEditUser(templateRef: TemplateRef<any>, userId: number) {
    this.editUserForm.reset();
    this.editUserForm.updateValueAndValidity();
    this.userService
      .getUserDetailById(userId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.userDetails = res[ResultEnum.Model];
          if (this.userDetails) {
            this.editUserForm.patchValue({
              FirstName: this.userDetails.FirstName,
              LastName: this.userDetails.LastName,
              UserName: this.userDetails.UserName,
              Role: this.roleList.find(x => x.Id == Number(this.userDetails.RoleId)) as any,
              Email: this.userDetails.Email,
              Mobile: this.userDetails.Mobile,
              IsActive: this.userDetails.IsActive,
            });
          }
          else {
            this.toaster.error('User not found');
          }
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      });
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  openDeleteModel(templateRef: TemplateRef<any>, userId: number) {
    this.selectedUserId = userId;
    this.dialog.open(templateRef);
  }

  onClickAddUser() {
    const userFormValue = this.userForm.value as any;
    const user = {
      Id: 0,
      FirstName: userFormValue.FirstName,
      LastName: userFormValue.LastName,
      UserName: userFormValue.UserName,
      Password: userFormValue.UserName,
      RoleId: userFormValue.Role.Id,
      Email: userFormValue.Email,
      Mobile: userFormValue.Mobile
    } as Users;

    this.userService.addUser(user).subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res.Message);
          this.userForm.reset();
          this.apiUserList();
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

  onClickUpdateUser() {
    const userFormValue = this.editUserForm.value as any;
    const user = {
      Id: this.userDetails.Id,
      FirstName: userFormValue.FirstName,
      LastName: userFormValue.LastName,
      UserName: userFormValue.UserName,
      Password: this.userDetails.Password,
      RoleId: userFormValue.Role.Id,
      Email: userFormValue.Email,
      Mobile: userFormValue.Mobile,
      IsActive: userFormValue.IsActive
    } as Users;

    this.updateService(user);
  }
  onClickDeleteUser() {
    this.userService
      .deleteUser(this.selectedUserId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res[ResultEnum.Message]);
          this.apiUserList();
          this.selectedUserId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }

 async updateService(user:any){
    await this.userService.updateUser(user).subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res.Message);
          this.editUserForm.reset();
          this.apiUserList();
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

  IsActiveFlagUpdate(element:any,e:any){
    element.IsActive = e.srcElement.checked;
    this.updateService(element);
  }
}
