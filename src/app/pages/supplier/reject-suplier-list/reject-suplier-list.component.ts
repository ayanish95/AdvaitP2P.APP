import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Suppliers } from '@core/models/suppliers';
import { SupplierService } from '@core/services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reject-suplier-list',
  templateUrl: './reject-suplier-list.component.html',
  styleUrls: ['./reject-suplier-list.component.scss']
})
export class RejectSuplierListComponent {
  //This component show rejected supplier list
  @Input() searchText!:string;
  @Input() supplierList!:Suppliers[];
  propChanges: any;

  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'SupplierCode',
    'ERPSupplierCode',
    'SupplierName',
    // 'SapUserId',
    // 'AccountGroup',
    'City',
    'Country',
    'Phone',
    'View'
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  allSuppliierList!: Suppliers[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;

  constructor(private supplierService: SupplierService,private toast:ToastrService){

  }

  ngOnInit(): void {
    this.allSuppliierList= this.supplierList;
    this.dataSource.data = this.allSuppliierList;
    this.dataSource.paginator = this.paginator;
    this.filter = new Filter();
    this.filter.OrderBy = OrderBy.DESC;
    this.filter.OrderByColumn = 'id';
    this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
  }

  //On change event when tab change from parent component
  ngOnChanges(changes: SimpleChanges){
    this.propChanges = changes;
    if(this.propChanges.searchText){
      const currentValue = this.propChanges.searchText?.currentValue;
      if(currentValue != undefined)
      this.searchSupplier(currentValue);
    }
    if(this.propChanges.supplierList){
      const currentValue = this.propChanges.supplierList?.currentValue;
      this.allSuppliierList = currentValue;
      this.dataSource.data = this.allSuppliierList;
      this.dataSource.paginator = this.paginator;
      this.filter = new Filter();
      this.filter.OrderBy = OrderBy.DESC;
      this.filter.OrderByColumn = 'id';
      this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
    }
  }

  // Search supplier from parent component
  searchSupplier(filterValue: any) {
    filterValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //Supplier list pagination page change event
  pageChange(page: PageEvent) {
    this.index = page.pageIndex * page.pageSize;
    this.filter.PageSize = page.pageSize;
    this.filter.Page = page.pageIndex + 1;
  }
  }


