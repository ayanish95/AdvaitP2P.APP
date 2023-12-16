import { X } from '@angular/cdk/keycodes';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Plants } from '@core/models/plants';
import { Roles } from '@core/models/roles';
import { Users } from '@core/models/users';
import { PlantService } from '@core/services/plant.service';
import { RoleService } from '@core/services/role.service';
import { UserService } from '@core/services/user.service';
import { TablesDataService } from 'app/routes/tables/data.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [TablesDataService, UserService],
})
export class UserListComponent {
  isLoading = true;
  displayedColumns: string[] = ['srNo', 'userName', 'name', 'roleName', 'erpUserId', 'email', 'mobile', 'isActive', 'Actions'
    // , 'edit'
    // , 'View'
    // , 'delete'
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  userList!: Users[];
  userDetails!: Users;
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
    UserName: ['', [Validators.required]],
    Password: ['', [Validators.required]],
    Role: ['', [Validators.required]],
    Email: ['', [Validators.required]],
    Mobile: ['', [Validators.required]],
    Plant: ['', [Validators.required]],
  });
  editUserForm = this.fb.group({
    FirstName: ['', [Validators.required]],
    LastName: [''],
    UserName: ['', [Validators.required]],
    Password: ['', [Validators.required]],
    Role: ['', [Validators.required]],
    Email: ['', [Validators.required]],
    Mobile: ['', [Validators.required]],
    Plant: ['', [Validators.required]],
    IsActive: [false]
  });

  plantList!: Plants[];
  filteredPlants!: Observable<any>;
  searchPlantControl = new FormControl();
  searchRoleControl = new FormControl();

  constructor(
    private dataSrv: TablesDataService,
    private dialog: MatDialog,
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private plantService: PlantService,
  ) { }

  ngOnInit() {
    this.selectedUserId = 0;
    this.apiUserList();
    this.apiPlant();
    this.apiRole();
  }

  // API for user list
  apiUserList() {
    this.userService
      .getUserList().subscribe({
        next: (res: any) => {
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
        },
        error: (e) => { this.toaster.error(e.Message); },
        complete() { },
      });
  }
  // API for plant list which is use while creat or update users
  apiPlant() {
    this.plantService.getPlantList().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.plantList = res[ResultEnum.Model];
          this.filteredPlants = this.searchPlantControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterPlant(value || ''))
          );
        }
      },
      error: (e) => { this.toaster.error(e.Message); },
      complete() { },
    });
  }

  // API for roles list
  apiRole() {
    this.roleService
      .getAllRoleList().subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.roleList = res[ResultEnum.Model];
            this.filteredRoles = this.searchRoleControl!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterRoles(value || ''))
            );
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        },
        error: (e) => { this.toaster.error(e.Message); },
        complete() { },
      });
  }

  // Search plant for plant dropdown
  filterPlant(name: any) {
    return this.plantList.filter(plant =>
      plant?.PlantName?.toLowerCase().includes(name.toLowerCase()) ||
      plant?.PlantCode?.toLowerCase().includes(name.toLowerCase()));
  }
  // Search role for roles dropdown
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
// funcation for display role in dropdown
  roleDisplayFn(role: Roles) {
    return role ? role.DisplayName! : '';
  }

  // Global search for user
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

  // Modal popup for create user
  openModelAddUser(templateRef: TemplateRef<any>) {
    this.userForm.reset();
    this.userForm.updateValueAndValidity();
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }

  // Model popup for edit user details
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
              Password: this.userDetails?.Password,
              Role: this.roleList.find(x => x.Id == Number(this.userDetails.RoleId)) as any,
              Email: this.userDetails.Email,
              Mobile: this.userDetails.Mobile,
              Plant: this.plantList?.filter(x => this.userDetails.PlantId?.includes(x.Id)) as any,
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

  // Open alert modal popup for delete user
  openDeleteModel(templateRef: TemplateRef<any>, userId: number) {
    this.selectedUserId = userId;
    this.dialog.open(templateRef);
  }

  // User save api
  onClickAddUser() {
    const userFormValue = this.userForm.value as any;
    let plantId = userFormValue.Plant.map((x: any) => x.Id);
    const user = {
      Id: 0,
      FirstName: userFormValue.FirstName,
      LastName: userFormValue.LastName,
      UserName: userFormValue.UserName,
      Password: userFormValue.UserName,
      RoleId: userFormValue.Role.Id,
      Email: userFormValue.Email,
      Mobile: userFormValue.Mobile,
      PlantId: plantId,
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

  //User update api
  onClickUpdateUser() {
    const userFormValue = this.editUserForm.value as any;
    let plantId = userFormValue.Plant.map((x: any) => x.Id);
    const user = {
      Id: this.userDetails.Id,
      FirstName: userFormValue.FirstName,
      LastName: userFormValue.LastName,
      UserName: userFormValue.UserName,
      Password: userFormValue.Password,
      RoleId: userFormValue.Role.Id,
      Email: userFormValue.Email,
      Mobile: userFormValue.Mobile,
      PlantId: plantId,
      IsActive: userFormValue.IsActive
    } as Users;

    this.updateService(user);
  }

  //User delete api
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

  async updateService(user: any) {
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

  // User active or inactive api call
  IsActiveFlagUpdate(element: any, e: any) {
    element.IsActive = e.srcElement.checked;
    this.updateService(element);
  }
}
