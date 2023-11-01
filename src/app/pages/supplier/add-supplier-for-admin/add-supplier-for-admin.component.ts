import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResultEnum } from '@core/enums/result-enum';
import { Country } from '@core/models/country';
import { ProductGroup } from '@core/models/products';
import { States } from '@core/models/states';
import { Suppliers } from '@core/models/suppliers';
import { CountryService } from '@core/services/country.service';
import { ProductGroupService } from '@core/services/product-group.service';
import { StateService } from '@core/services/state.service';
import { SupplierService } from '@core/services/supplier.service';
import { ApproveSupplierComponent } from '@shared/dialog/approve-supplier/approve-supplier.component';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, startWith, map } from 'rxjs';

@Component({
  selector: 'app-add-supplier-for-admin',
  templateUrl: './add-supplier-for-admin.component.html',
  styleUrls: ['./add-supplier-for-admin.component.scss']
})
export class AddSupplierForAdminComponent implements OnInit {
  basicInfoFrom = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required]],
      lastName: [''],
      telePhone: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      gstNumber: [''],
      panNumber: [''],
      taxNumber: [''],
      productGroup: ['', [Validators.required]],
      country: ['', [Validators.required]]
    }
  );
  addressForm = this.fb.group({
    street1: ['', [Validators.required]],
    street2: [''],
    postalcode: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['', [Validators.required]],
  });
  bankDetailsFrom = this.fb.nonNullable.group(
    {
      bankCountry: ['', [Validators.required]],
      ifscCode: [''],
      swiftCode: [''],
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      accountHolderName: ['', [Validators.required]],
      remarks: [''],
      IsActive: [false],
      // suppplierAccountGroup: ['', [Validators.required]],
      // compoanyCode: ['', [Validators.required]],
    }
  );

  supplierTypes = [
    { id: 'Domestic', name: 'Domestic' },
    { id: 'International', name: 'International' }
  ];

  isLinear = true;
  supplier!: Suppliers;

  value = '';
  filteredStates!: Observable<any>;

  productGroupList!: ProductGroup[];
  countryList!: Country[];
  filteredCountry!: Observable<Country[]>;
  filteredProductsGroup!: Observable<ProductGroup[]>;
  stateList!: States[];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedProduct: string[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('autocompleteTrigger') matACTrigger!: MatAutocompleteTrigger;
  selectedCountry!: string;
  selectedBankCountry!: string;
  selectedIndex = 0;
  selectedSupplierId!: number;
  isEdit = false;
  supplierDetails!: Suppliers;
  constructor(private fb: FormBuilder, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any, private stateService: StateService, private productGroupService: ProductGroupService, private supplierService: SupplierService,
    private toast: ToastrService, private countryService: CountryService, private dialogRef: MatDialogRef<AddSupplierForAdminComponent>) { }

  ngOnInit(): void {
    this.selectedSupplierId = this.data?.supplierId;
    this.apiProductGroup();
    this.apiCountryList();
    this.apiState();


  }

  apiProductGroup() {
    this.productGroupService
      .getProductGroupList()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.productGroupList = res[ResultEnum.Model];
          this.productGroupList.map(x => x.ProductFullName = x.ProductGroupName + (x.Description ? ' - ' + x.Description : ''));
          if (this.selectedSupplierId) {
            this.isEdit = true;
            this.apiGetSupplierById(this.selectedSupplierId);
          }
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
          this.filteredCountry = this.basicInfoFrom.get('country')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterCountry(value || ''))
          );
        }
      });
  }

  apiState() {
    this.stateService.getStateList()
      .pipe(finalize(() => { }))
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.stateList = res[ResultEnum.Model];
          this.filteredStates = this.addressForm.get('state')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterStates(value || ''))
          );
        }
      });
  }

  async apiGetStateByCountryList(countryCode: string) {
    this.stateService.getStateListByCountryCode(countryCode).pipe(finalize(() => { }))
      .subscribe(res => {
        if (res[ResultEnum.IsSuccess]) {
          this.stateList = res[ResultEnum.Model];
          this.filteredStates = this.addressForm.get('state')!.valueChanges.pipe(
            startWith(''),
            map(value => this.filterStates(value || ''))
          );
        }
        else {
          this.selectedIndex = 0;
          this.toast.error(res[ResultEnum.Message]);
        }
      });
  }

  apiGetSupplierById(supplierId: number) {
    this.supplierService.getSupplierDetailById(supplierId).pipe(
      finalize(() => { })
    )
      .subscribe(async res => {
        if (res[ResultEnum.IsSuccess]) {
          this.supplierDetails = res[ResultEnum.Model] as Suppliers;
          if (this.supplierDetails) {
            this.selectedCountry = this.trimFormValue(this.supplierDetails.Country);
            this.selectedBankCountry = this.trimFormValue(this.supplierDetails.BankCountry);
            await this.apiGetStateByCountryList(this.selectedCountry);
            const data = this.countryList?.filter(x => x.CountryCode == this.supplierDetails?.Country);
            this.addressForm.get('country')?.setValue(data[0].CountryWithCode);
            this.addressForm.get('country')?.disable();

            const productGroupId: number[] = [];
            this.supplierDetails?.ProductGroupId?.forEach(element => {
              const id = this.productGroupList?.find(x => x.Id == element)?.Id;
              if (id)
                productGroupId.push(id);
              return productGroupId;
            });

            this.basicInfoFrom.patchValue({
              firstName: this.trimFormValue(this.supplierDetails.FirstName),
              lastName: this.trimFormValue(this.supplierDetails.LastName),
              telePhone: this.trimFormValue(this.supplierDetails.Phone),
              emailId: this.trimFormValue(this.supplierDetails.Email),
              gstNumber: this.trimFormValue(this.supplierDetails.GSTNumber),
              panNumber: this.trimFormValue(this.supplierDetails.PANNumber),
              taxNumber: this.trimFormValue(this.supplierDetails.TaxNumber),
              productGroup: productGroupId as any,
              country: this.countryList?.find(x => x.CountryCode == this.trimFormValue(this.supplierDetails.Country)) as any
            });
            this.addressForm.patchValue({
              street1: this.trimFormValue(this.supplierDetails.Street1),
              street2: this.trimFormValue(this.supplierDetails.Street2),
              city: this.trimFormValue(this.supplierDetails.City),
              postalcode: this.trimFormValue(this.supplierDetails.PostalCode),
              state: this.stateList?.find(x => x.GSTStateCode == this.trimFormValue(this.supplierDetails.State)) as any,
              country: this.trimFormValue(this.supplierDetails.Country),
            });
            this.bankDetailsFrom.patchValue({
              bankCountry: this.trimFormValue(this.supplierDetails.BankCountry),
              ifscCode: this.trimFormValue(this.supplierDetails.IFSCCode),
              swiftCode: this.trimFormValue(this.supplierDetails.SwiftCode),
              bankName: this.trimFormValue(this.supplierDetails.BankName),
              accountNumber: this.trimFormValue(this.supplierDetails.AccountNumber),
              accountHolderName: this.trimFormValue(this.supplierDetails.AccountHolderName),
              remarks: this.trimFormValue(this.supplierDetails.Remarks),
              IsActive: this.supplierDetails.IsActive
            });

          }
        }
        else {
          this.toast.error(res[ResultEnum.Message]);
        }
      });
  }
  trimFormValue(value: any) {
    if (value)
      return value;
    else
      return '';
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
  countryDisplayFn(country: Country) {
    return country ? country.CountryWithCode! : '';
  }
  stateDisplayFn(state: any) {
    return state ? state?.Name! : '';
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
  filterProduct(name: any) {
    if (name?.Description) {
      return this.productGroupList.filter(state =>
        state.ProductFullName?.toLowerCase().indexOf(name) === 0);
    }
    else {
      return this.productGroupList.filter(state =>
        state.ProductFullName?.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedProduct.push(value.trim());
    }

    // // Reset the input value
    if (input) {
      input.value = '';
    }
    this.basicInfoFrom.get('productGroup')?.setValue('');
  }
  remove(fruit: string): void {
    const index = this.selectedProduct.indexOf(fruit);
    this.selectedProduct.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const newValue = event.option.value?.Id;
    if (this.selectedProduct.includes(newValue)) {
      this.selectedProduct = [...this.selectedProduct.filter(fruit => fruit !== newValue)];
    } else {
      this.selectedProduct.push(event.option.viewValue);
    }
    this.fruitInput.nativeElement.value = '';
    // this.basicInfoFrom.get('productGroup')?.setValue('');

    // keep the autocomplete opened after each item is picked.
    requestAnimationFrame(() => {
      this.openAuto(this.matACTrigger);
    });

  }

  convertToString(id: number) {
    return id.toString();
  }

  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
    this.fruitInput.nativeElement.focus();
  }

  onChangeCountry(event: any) {
    this.selectedCountry = event.source?.value?.CountryCode;
    this.bankDetailsFrom.get('bankCountry')?.setValue(event.source?.value?.CountryCode);
    this.selectedBankCountry = event.source?.value?.CountryCode;
    this.addressForm.get('city')?.setValue(null);
    this.addressForm.get('state')?.setValue(null);
    if (event.source?.value?.CountryCode == 'IN') {
      this.basicInfoFrom.controls.gstNumber.setValidators([Validators.required]);
      this.basicInfoFrom.controls.panNumber.setValidators([Validators.required]);
      this.basicInfoFrom.controls.taxNumber.setValidators(null);
      this.bankDetailsFrom.controls.swiftCode.setValidators(null);
      this.bankDetailsFrom.controls.ifscCode.setValidators([Validators.required]);

    }
    else {
      this.basicInfoFrom.controls.taxNumber.setValidators([Validators.required]);
      this.basicInfoFrom.controls.gstNumber.setValidators(null);
      this.basicInfoFrom.controls.panNumber.setValidators(null);
      this.bankDetailsFrom.controls.swiftCode.setValidators([Validators.required]);
      this.bankDetailsFrom.controls.ifscCode.setValidators(null);
    }
    const data = this.countryList.filter(x => x.CountryCode == event.source?.value?.CountryCode);
    this.addressForm.get('country')?.setValue(data[0].CountryWithCode);
    this.addressForm.get('country')?.disable();
    this.basicInfoFrom.controls.taxNumber.updateValueAndValidity();
    this.basicInfoFrom.controls.gstNumber.updateValueAndValidity();
    this.basicInfoFrom.controls.panNumber.updateValueAndValidity();
    this.bankDetailsFrom.controls.swiftCode.updateValueAndValidity();
    this.bankDetailsFrom.controls.ifscCode.updateValueAndValidity();
    this.bankDetailsFrom.markAsPristine();
    this.addressForm.markAsPristine();

  }

  onChangeBankCountry(event: any) {
    this.selectedBankCountry = event;
    if (event == 'IN') {
      this.bankDetailsFrom.controls.swiftCode.setValidators(null);
      this.bankDetailsFrom.controls.ifscCode.setValidators([Validators.required]);

    }
    else {
      this.bankDetailsFrom.controls.swiftCode.setValidators([Validators.required]);
      this.bankDetailsFrom.controls.ifscCode.setValidators(null);
    }
    this.bankDetailsFrom.controls.swiftCode.updateValueAndValidity();
    this.bankDetailsFrom.controls.ifscCode.updateValueAndValidity();
  }


  matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source)!;
      const targetControl = control.get(target)!;
      if (targetControl.errors && !targetControl.errors.mismatch) {
        return null;
      }
      if (sourceControl.value !== targetControl.value) {
        targetControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl.setErrors(null);
        return null;
      }
    };
  }

  selectionChange(event: StepperSelectionEvent) {
    this.basicInfoFrom.touched;

    if (this.basicInfoFrom.valid) {
      this.selectedIndex = event.selectedIndex;
      const stepLabel = event.selectedStep.label;
      const gstNumber = this.basicInfoFrom.get('gstNumber')?.value;
      const coutnryCode = this.basicInfoFrom.get('country')?.value as any;

      if (stepLabel == 'Address') {
        this.addressForm.markAsUntouched();
        if (gstNumber && !this.isEdit) {
          this.supplierService.getSupplierByGSTNumber(gstNumber).pipe(
            finalize(() => {
            })
          )
            .subscribe(res => {
              if (res[ResultEnum.IsSuccess]) {
                if (res[ResultEnum.Model]?.length > 0) {
                  this.selectedIndex = 0;
                  this.toast.error(res.Message);
                }
              }
            });
        }
        if (coutnryCode?.CountryCode) {
          this.apiGetStateByCountryList(coutnryCode?.CountryCode);
        }
      }
      return;
    }
    else {
      this.selectedIndex = this.selectedIndex;
    }
  }
  nextOrPrevious(type: string) {
    if (this.basicInfoFrom.invalid && this.selectedIndex == 0 && type == 'next') {
      this.basicInfoFrom.markAllAsTouched();
      this.selectedIndex = 0;
      return;
    }
    if (this.addressForm.invalid && this.selectedIndex == 1 && type == 'next') {
      this.addressForm.markAllAsTouched();
      this.selectedIndex = 1;
      return;
    }
    // if(this.bankDetailsFrom.invalid)
    // this.selectedIndex=2;
    if (type == 'next')
      this.selectedIndex = this.selectedIndex + 1;
    else
      this.selectedIndex = this.selectedIndex - 1;
  }


  onClickRegister() {
    const basicInfoForm = this.basicInfoFrom.value as any;
    const addressForm = this.addressForm.value as any;
    const stateId = this.stateList.find(x => x.Id === addressForm.state?.Id);
    const bankDetailForm = this.bankDetailsFrom.value;
    const supplier = {
      Id: this.selectedSupplierId ? this.selectedSupplierId : 0,
      FirstName: basicInfoForm.firstName,
      LastName: basicInfoForm.lastName,
      Email: basicInfoForm.emailId,
      Phone: basicInfoForm.telePhone,
      GSTNumber: basicInfoForm.gstNumber,
      PANNumber: basicInfoForm.panNumber,
      TaxNumber: basicInfoForm.taxNumber,
      ProductGroupId: basicInfoForm.productGroup,
      Country: basicInfoForm.country?.CountryCode,
      Street1: addressForm.street1 ? addressForm.street1 : '',
      Street2: addressForm.street2 ? addressForm.street2 : '',
      PostalCode: addressForm.postalcode ? addressForm.postalcode : '',
      City: addressForm.city ? addressForm.city : '',
      State: stateId?.GSTStateCode,
      BankCountry: bankDetailForm.bankCountry,
      IFSCCode: bankDetailForm.ifscCode,
      SwiftCode: bankDetailForm.swiftCode,
      BankName: bankDetailForm.bankName,
      AccountNumber: bankDetailForm.accountNumber,
      AccountHolderName: bankDetailForm.accountHolderName,
      Remarks: bankDetailForm.remarks,
      ERPStatus: this.supplierDetails?.ERPStatus ? this.supplierDetails?.ERPStatus : false,
      IsActive: this.isEdit ? bankDetailForm.IsActive : true,
    } as Suppliers;
    if (!this.isEdit) {
      this.supplierService.supplierRegisterFromAdmin(supplier).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toast.success(res.Message);
            this.basicInfoFrom.reset();
            this.addressForm.reset();
            this.bankDetailsFrom.reset();

            this.dialogRef.close();
          }
          else {
            this.toast.error(res.Message);
          }
        },
        error: (e) => { this.toast.error(e.Message); },
        complete() {

        },
      });
    } else {
      this.supplierService.updateSupplier(supplier).subscribe({
        next: (res: any) => {
          if (res[ResultEnum.IsSuccess]) {
            this.toast.success(res.Message);
            this.basicInfoFrom.reset();
            this.addressForm.reset();
            this.bankDetailsFrom.reset();

            this.dialogRef.close();
          }
          else {
            this.toast.error(res.Message);
          }
        },
        error: (e) => { this.toast.error(e.Message); },
        complete() {

        },
      });
    }
  }

}
