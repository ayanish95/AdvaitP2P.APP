import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultEnum } from '@core/enums/result-enum';
import { Filter, OrderBy } from '@core/models/base-filter';
import { Country } from '@core/models/country';
import { Plants } from '@core/models/plants';
import { Products } from '@core/models/products';
import { States } from '@core/models/states';
import { CountryService } from '@core/services/country.service';
import { PlantService } from '@core/services/plant.service';
import { StateService } from '@core/services/state.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, map, startWith } from 'rxjs';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss']
})
export class PlantListComponent implements OnInit {

  isLoading = true;
  displayedColumns: string[] = [
    'srNo',
    'PlantCode',
    'ERPPlantCode',
    'PlantName',
    'Street1',
    'City',
    'Country',
    'Pincode',
    'IsActive',
    'Edit',
    'Delete',
  ];
  dataSource = new MatTableDataSource<any>();
  dataSource1: any;
  currentPage = 1;
  pageSize = 10;
  plantList!: Plants[];
  @ViewChild('paginator')
  paginator!: MatPaginator;
  filter: Filter = new Filter();
  index = 0;
  isEdit: boolean = false;
  countryList!: Country[];
  filteredCountry!: Observable<Country[]>;
  stateList!: States[];
  filteredStates!: Observable<any>;
  selectedCountryCode!: string;
  selectedPlantId!: number;
  plantDetails!: Plants;
  plantForm = this.fb.group({
    PlantName: ['', [Validators.required]],
    Email: ['', [Validators.required]],
    Mobile: ['', [Validators.required]],
    Street1: ['', [Validators.required]],
    Street2: [''],
    City: ['', [Validators.required]],
    PostalCode: ['', [Validators.required]],
    State: ['', [Validators.required]],
    Country: ['', [Validators.required]],
    CompanyCode: ['', [Validators.required]],
    GSTNumber: [''],
    TaxNumber: [''],
    BusinessPlace: ['', [Validators.required]],
    IsActive: [false],
  });

  constructor(private plantService: PlantService, private fb: FormBuilder, private dialog: MatDialog, private countryService: CountryService, private stateService: StateService,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.apiPlantList();
    this.apiCountryList();
    this.apiStateListByCountryCode();
    this.filteredCountry = this.plantForm.get('Country')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCountry(value || ''))
    );

  }

  apiPlantList() {
    this.plantService
      .getPlantList()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.plantList = res[ResultEnum.Model];
          this.dataSource.data = this.plantList;
          this.dataSource.paginator = this.paginator;
          this.filter = new Filter();
          this.filter.OrderBy = OrderBy.DESC;
          this.filter.OrderByColumn = 'id';
          this.filter.TotalRecords = this.dataSource.data ? this.dataSource.data.length : 0;
        }
      });
  }

  apiCountryList() {
    this.countryService
      .getCountryList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.countryList = res[ResultEnum.Model];
          this.countryList.map(x => x.CountryWithCode = x.CountryCode + (x.Name ? ' - ' + x.Name : ''));
        }
      });
  }

  apiStateListByCountryCode(countryCode?: string) {
    if (countryCode) {
      this.stateService.getStateListByCountryCode(countryCode ? countryCode : '').pipe(finalize(() => { }))
        .subscribe(res => {
          if (res[ResultEnum.IsSuccess]) {
            this.stateList = res[ResultEnum.Model];
            this.filteredStates = this.plantForm.get('State')!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterStates(value || ''))
            );
          }
          else {
            this.toaster.error(res[ResultEnum.Message]);
          }
        });
    }
    else {
      this.stateService.getStateList().pipe(finalize(() => { }))
        .subscribe(res => {
          if (res[ResultEnum.IsSuccess]) {
            this.stateList = res[ResultEnum.Model];
            this.filteredStates = this.plantForm.get('State')!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterStates(value || ''))
            );
          }
          else {
            this.toaster.error(res[ResultEnum.Message]);
          }
        });
    }
  }

  filterCountry(name: any) {
    if (name?.CountryWithCode) {
      return this.countryList.filter(role =>
        role?.CountryWithCode?.toLowerCase().includes(name.CountryWithCode.toLowerCase()));
    }
    else {
      return this.countryList.filter(role =>
        role?.CountryWithCode?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  filterStates(name: any) {
    if (name?.Name) {
      return this.stateList?.filter(role =>
        role?.Name?.toLowerCase().includes(name.Name.toLowerCase()));
    }
    else {
      return this.stateList?.filter(role =>
        role?.Name?.toLowerCase().includes(name.toLowerCase()));
    }
  }

  countryDisplayFn(country: Country) {
    return country ? country.CountryWithCode! : '';
  }
  stateDisplayFn(state: States) {
    return state ? state.Name! : '';
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

  onChangeCountry(event: any) {
    // this.plantForm.get('City')?.setValue(null);
    this.plantForm.get('State')?.setValue(null);
    let countryCode = event.source?.value?.CountryCode;
    this.selectedCountryCode = countryCode;
    this.apiStateListByCountryCode(countryCode)
    if (countryCode == 'IN') {
      this.plantForm.controls.GSTNumber.setValidators([Validators.required]);
      this.plantForm.controls.TaxNumber.setValidators(null);
    }
    else {
      this.plantForm.controls.TaxNumber.setValidators([Validators.required]);
      this.plantForm.controls.GSTNumber.setValidators(null);
    }
    this.plantForm.controls.TaxNumber.updateValueAndValidity();
    this.plantForm.controls.GSTNumber.updateValueAndValidity();
  }

  openAddPlantModel(templateRef: TemplateRef<any>) {
    this.isEdit = false;
    this.plantForm.reset();
    this.plantForm.updateValueAndValidity();
    this.dialog.open(templateRef, {
      width: '56vw',
      panelClass: 'custom-modalbox'
    });
  }
  openEditModelPopup(templateRef: TemplateRef<any>, plantId: number) {
    this.isEdit = true;
    this.selectedPlantId = plantId;
    this.plantForm.reset();
    this.plantForm.updateValueAndValidity();
    this.plantService
      .getPlantDetailsById(plantId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(async res => {
        if (res[ResultEnum.IsSuccess]) {
          this.plantDetails = res[ResultEnum.Model];
          if (this.plantDetails) {
            await this.apiStateListByCountryCode(this.plantDetails.Country ? this.plantDetails.Country : '');
            this.selectedCountryCode = this.plantDetails.Country ? this.plantDetails.Country : '';
            this.plantForm.patchValue({
              PlantName: this.plantDetails.PlantName,
              Email: this.plantDetails.Email,
              Mobile: this.plantDetails.Mobile,
              Street1: this.plantDetails.Street1,
              Street2: this.plantDetails.Street2,
              City: this.plantDetails.City,
              PostalCode: this.plantDetails.Pincode,
              Country: this.countryList.find(x => x.CountryCode == this.plantDetails.Country) as any,
              State: this.stateList.find(x => x.Id == this.plantDetails.StateId) as any,
              BusinessPlace: this.plantDetails.BusinessPlace,
              GSTNumber: this.plantDetails.GST,
              TaxNumber: this.plantDetails.TaxNumber,
              CompanyCode: this.plantDetails.CompanyCode,
              IsActive: this.plantDetails.IsActive,
            });
          }
          else {
            this.toaster.error("User not found");
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

  openDeleteModel(templateRef: TemplateRef<any>, plantId: number) {
    this.selectedPlantId = plantId;
    this.dialog.open(templateRef);
  }

  onClickAddPlant() {
    let plantdata = this.plantForm.value as any;
    let plant = {
      Id: this.isEdit ? this.selectedPlantId : 0,
      PlantCode: '',
      PlantName: plantdata.PlantName,
      Email: plantdata.Email,
      Mobile: plantdata.Mobile,
      Street1: plantdata.Street1,
      Street2: plantdata.Street2,
      Country: plantdata.Country?.CountryCode,
      StateId: plantdata.State?.Id,
      ERPStateCode: plantdata.State?.ERPStateCode,
      City: plantdata.City,
      Pincode: plantdata.PostalCode,
      GST: plantdata.GSTNumber,
      TaxNumber: plantdata.TaxNumber,
      BusinessPlace: plantdata.BusinessPlace,
      CompanyCode: plantdata.CompanyCode,
      IsActive: this.isEdit ? plantdata.IsActive : true,
    } as Plants;

    if (!this.isEdit) {
      this.plantService.addPlant(plant).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.plantForm.reset();
            this.apiPlantList();
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
      this.plantService.updatePlant(plant).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toaster.success(res.Message);
            this.plantForm.reset();
            this.apiPlantList();
            this.selectedPlantId = 0;
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

  onClickDeletePlant() {
    if (this.selectedPlantId == 0 || this.selectedPlantId == undefined)
      throw this.toaster.error('Something went wrong');
    this.plantService
      .deletePlant(this.selectedPlantId)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.toaster.success(res[ResultEnum.Message]);
          this.apiPlantList();
          this.selectedPlantId = 0;
        }
        else
          this.toaster.error(res[ResultEnum.Message]);

        this.dialog.closeAll();
      });
  }
}
