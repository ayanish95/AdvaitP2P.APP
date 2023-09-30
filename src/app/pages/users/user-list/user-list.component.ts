import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Users } from '@core/models/users';
import { UserService } from '@core/services/user.service';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { TablesDataService } from 'app/routes/tables/data.service';
import { TablesKitchenSinkEditComponent } from 'app/routes/tables/kitchen-sink/edit/edit.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [TablesDataService, UserService],
})
export class UserListComponent {
  list: any[] = [];
  isLoading = true;
  displayedColumns: string[] = ['srNo', 'userName', 'name', 'erpUserId', 'email', 'mobile'];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  userList!: Users[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;

  constructor(
    private dataSrv: TablesDataService,
    private dialog: MtxDialog,
    private userService: UserService
  ) {}

  ngOnInit() {
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
          console.log('userList', this.userList);
          this.filter = new Filter();
          this.filter.OrderBy = OrderBy.DESC;
          this.filter.OrderByColumn = 'id';
          this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
        }
      });
    this.list = this.dataSrv.getData();
    this.isLoading = false;
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
}
