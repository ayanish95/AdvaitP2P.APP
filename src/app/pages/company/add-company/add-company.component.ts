import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegexEnum } from '@core/enums/common-enum';
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
  countryList!: Country[];
  filteredCountry!: Observable<Country[]>;
  stateList!: States[];
  filteredStates!: Observable<any>;
  selectedCountryCode!: string;
  selectedCompantId!: number;
  plantDetails!: Plants;
  companyForm = this.fb.group({
    CompanyName: ['',[Validators.required,Validators.minLength(4)]],
    Street1: ['', [Validators.required]],
    Street2: [''],
    Street3: [''],
    City: ['', [Validators.required]],
    PostalCode: ['',[Validators.required]],
    State: [null, [Validators.required]],
    Country: [null, [Validators.required]],
    Mobile: ['', [Validators.required,Validators.pattern(RegexEnum.MobileNumberRegex)]],
    Email: ['',  [Validators.required, Validators.email,Validators.pattern(RegexEnum.EmailRegex)]],
    IsActive: [true],
  });
  Role = Role;
  searchStateControl = new FormControl();
  searchCountryControl = new FormControl();
  IsEdit = false;
  selectedCompanyDetails!: Company;

  constructor(private fb: FormBuilder, private countryService: CountryService, private stateService: StateService,
    private toaster: ToastrService, private dialogRef: MatDialogRef<AddCompanyComponent>, @Inject(MAT_DIALOG_DATA) private companyData: any) {
    if (this.companyData && this.companyData?.Company) {
      this.IsEdit = true;
      this.selectedCompanyDetails = this.companyData?.Company;
    }
  }

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
          if (this.selectedCompanyDetails) {
            this.companyForm.patchValue({
              CompanyName: this.selectedCompanyDetails.CompanyName,
              Street1: this.selectedCompanyDetails.Street1,
              Street2: this.selectedCompanyDetails.Street2,
              Street3: this.selectedCompanyDetails.Street3,
              City: this.selectedCompanyDetails.City,
              PostalCode: this.selectedCompanyDetails.PostalCode,
              State: this.stateList?.find(x => x.ERPStateCode == this.selectedCompanyDetails?.State?.ERPStateCode && x.CountryCode == this.selectedCompanyDetails.Country?.CountryCode) as any,
              Country: this.countryList?.find(x => x.CountryCode == this.selectedCompanyDetails?.Country?.CountryCode) as any,
              Mobile: this.selectedCompanyDetails.Telephone,
              Email: this.selectedCompanyDetails.Email,
              IsActive: this.selectedCompanyDetails.IsActive,
            });

          }

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
    const country = this.countryList?.find(x => x.CountryCode == event?.CountryCode) as any;
    this.companyForm.get('Country')?.setValue(country);
  }

  onClickAddPlant() {
    const companyData = this.companyForm.value as any;
    const company = {
      Id: this.IsEdit ? this.selectedCompanyDetails.Id : 0,
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
      IsActive: this.IsEdit ? companyData.IsActive : true,
    } as Company;
    this.dialogRef.close({ data: company });

  }
}
