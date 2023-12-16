import { Component, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { Users } from '@core/models/users';
import { UserService } from '@core/services/user.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent {
  displayedColumns: string[] = [
    'srNo',
    'PlantCode',
    'PlantName',
    'CompanyCode'
  ];
  userid!: number;
  userList!: Users;

  dataSource = new MatTableDataSource<any>();
  index = 0;
  constructor(private location: Location, private toaster: ToastrService, private userService: UserService,private dialog: MatDialog,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params: any) => {
      this.userid = params.id;
    });
  }

  ngOnInit(): void {
    this.userService
      .getUserDetailById(this.userid)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          if (res[ResultEnum.Model]) {
            this.userList = res[ResultEnum.Model];
          }
          else
            this.toaster.error(res[ResultEnum.Message]);
        }
        else
          this.toaster.error(res[ResultEnum.Message]);
      });
  }
  onClickBack() {
    this.location.back();
  }
  
  openModelAddUser(templateRef: TemplateRef<any>,plants:any) {
    this.dataSource.data=plants;
    this.dialog.open(templateRef, {
      width: '45vw',
      panelClass: 'custom-modalbox'
    });
  }
}
