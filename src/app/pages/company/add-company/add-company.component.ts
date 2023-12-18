import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ResultEnum } from '@core/enums/result-enum';
import { Role } from '@core/enums/role';
import { Company } from '@core/models/company';
import { Country } from '@core/models/country';
import { Plants } from '@core/models/plants';
import { States } from '@core/models/states';
import { CountryService } from '@core/services/country.service';
import { StateService } from '@core/services/state.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent {
  plantList!: Plants[];
  companyList!: Company[];
  isEdit = false;
  countryList!: Country[];
  filteredCountry!: Observable<Country[]>;
  stateList!: States[];
  filteredStates!: Observable<any>;
  selectedCountryCode!: string;
  selectedCompantId!: number;
  plantDetails!: Plants;
  companyForm = this.fb.group({
    CompanyName: ['', [Validators.required]],
    Street1: ['', [Validators.required]],
    Street2: [''],
    Street3: [''],
    City: ['', [Validators.required]],
    PostalCode: [''],
    State: ['', [Validators.required]],
    Country: [null, [Validators.required]],
    Mobile: ['', [Validators.required]],
    Email: ['', [Validators.required]],
    IsActive: [true],
  });
  Role = Role;
  searchStateControl = new FormControl();;
  searchCountryControl = new FormControl();;

  constructor(private fb: FormBuilder, private countryService: CountryService, private stateService: StateService,
    private toaster: ToastrService, private dialogRef: MatDialogRef<AddCompanyComponent>) { }

  ngOnInit() {
    this.apiCountryList();
    this.apiStateList();
  }

  apiCountryList() {
    this.countryService.getCountryList().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.countryList = res[ResultEnum.Model];
          this.countryList.map(x => x.CountryWithCode = x.CountryCode + (x.Name ? ' - ' + x.Name : ''));
          this.filteredCountry = this.searchCountryControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterCountry(value || ''))
          );
        }
      },
      error: (e) => { this.toaster.error(e.Message); }
    });
  }

  apiStateList() {
    this.stateService.getStateList().subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.stateList = res[ResultEnum.Model];
          this.filteredStates = this.searchStateControl!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterStates(value || ''))
          );
        }
        else {
          this.toaster.error(res[ResultEnum.Message]);
        }
      },
      error: (e) => { this.toaster.error(e.Message); }
    });
  }

  filterCountry(name: any) {
    return this.countryList.filter(role =>
      role?.CountryWithCode?.toLowerCase().includes(name.toLowerCase()));
  }

  filterStates(name: any) {
    return this.stateList?.filter(role =>
      role?.Name?.toLowerCase().includes(name.toLowerCase()));
  }

  onChangeState(event: any) {
    console.log('state',event);
    let country = this.countryList?.find(x=>x.CountryCode == event?.CountryCode) as any;
    this.companyForm.get('Country')?.setValue(country);
  }

  onClickAddPlant() {
    const companyData = this.companyForm.value as any;
    const company = {
      Id: this.isEdit ? this.selectedCompantId : 0,
      CompanyCode: '',
      CompanyName: companyData.CompanyName,
      Email: companyData.Email,
      Telephone: companyData.Mobile,
      Street1: companyData.Street1,
      Street2: companyData.Street2,
      Street3: companyData.Street3,
      StateCode: companyData.State?.ERPStateCode,
      StateId: companyData.State?.Id,
      // Country: companyData.Country?.CountryCode,
      CountryCode: companyData.Country?.CountryCode,
      City: companyData.City,
      PostalCode: companyData.PostalCode,
      IsActive: this.isEdit ? companyData.IsActive : true,
    } as Company;
    debugger
    this.dialogRef.close({ data: company });

  }
}
