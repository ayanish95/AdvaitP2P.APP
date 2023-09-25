import { Component } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { TablesDataService } from 'app/routes/tables/data.service';
import { TablesKitchenSinkEditComponent } from 'app/routes/tables/kitchen-sink/edit/edit.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [TablesDataService],
})
export class UserListComponent {
  columns: MtxGridColumn[] = [
    {
      header: this.translate.stream('table_kitchen_sink.position'),
      field: 'position',
      sortable: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: this.translate.stream('table_kitchen_sink.name'),
      field: 'name',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: this.translate.stream('table_kitchen_sink.weight'),
      field: 'weight',
      minWidth: 100,
    },
    {
      header: this.translate.stream('table_kitchen_sink.symbol'),
      field: 'symbol',
      minWidth: 100,
    },
    {
      header: this.translate.stream('table_kitchen_sink.gender'),
      field: 'gender',
      minWidth: 100,
    },
    {
      header: this.translate.stream('table_kitchen_sink.mobile'),
      field: 'mobile',
      hide: true,
      minWidth: 120,
    },
    {
      header: this.translate.stream('table_kitchen_sink.tele'),
      field: 'tele',
      minWidth: 120,
      width: '120px',
    },
    {
      header: this.translate.stream('table_kitchen_sink.birthday'),
      field: 'birthday',
      minWidth: 180,
    },
    {
      header: this.translate.stream('table_kitchen_sink.city'),
      field: 'city',
      minWidth: 120,
    },
    {
      header: this.translate.stream('table_kitchen_sink.address'),
      field: 'address',
      minWidth: 180,
      width: '200px',
    },
    {
      header: this.translate.stream('table_kitchen_sink.company'),
      field: 'company',
      minWidth: 120,
    },
    {
      header: this.translate.stream('table_kitchen_sink.website'),
      field: 'website',
      minWidth: 180,
    },
    {
      header: this.translate.stream('table_kitchen_sink.email'),
      field: 'email',
      minWidth: 180,
    },
  ];
  list: any[] = [];
  isLoading = true;

  multiSelectable = true;
  rowSelectable = true;
  hideRowSelectionCheckbox = false;
  showToolbar = true;
  columnHideable = true;
  columnSortable = true;
  columnPinnable = true;
  rowHover = false;
  rowStriped = false;
  showPaginator = true;
  expandable = false;
  columnResizable = false;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  currentPage = 1;
  constructor(
    private translate: TranslateService,
    private dataSrv: TablesDataService,
    private dialog: MtxDialog,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserList().subscribe(data => {
      console.log('data', data);
    });
    this.list = this.dataSrv.getData();
    this.isLoading = false;
  }

  edit(value: any) {
    const dialogRef = this.dialog.originalOpen(TablesKitchenSinkEditComponent, {
      width: '600px',
      data: { record: value },
    });

    dialogRef.afterClosed().subscribe(() => console.log('The dialog was closed'));
  }

  delete(value: any) {
    this.dialog.alert(`You have deleted ${value.position}!`);
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(e: any) {
    console.log(e);
  }

  enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  }

  updateCell() {
    this.list = this.list.map(item => {
      item.weight = Math.round(Math.random() * 1000) / 100;
      return item;
    });
  }

  updateList() {
    this.list = this.list.splice(-1).concat(this.list);
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
