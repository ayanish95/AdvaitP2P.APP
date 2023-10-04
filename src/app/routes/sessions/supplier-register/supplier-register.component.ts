import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ResultEnum } from '@core/enums/result-enum';
import { ProductGroup, Products } from '@core/models/products';
import { Suppliers } from '@core/models/suppliers';
import { ProductService } from '@core/services/product.service';
import { Observable, finalize, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { StateService } from '@core/services/state.service';
import { State } from '@popperjs/core';
import { States } from '@core/models/states';
import { ProductGroupService } from '@core/services/product-group.service';
import { SupplierService } from '@core/services/supplier.service';
import { CommonEnum } from '@core/enums/common-enum';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CountryService } from '@core/services/country.service';
import { Country } from '@core/models/country';
@Component({
  selector: 'app-supplier-register',
  templateUrl: './supplier-register.component.html',
  styleUrls: ['./supplier-register.component.scss']
})
export class SupplierRegisterComponent implements OnInit {
  basicInfoFrom = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      telePhone: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      gstNumber: [''],
      panNumber: [''],
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
      // suppplierAccountGroup: ['', [Validators.required]],
      // compoanyCode: ['', [Validators.required]],
    }
  );

  supplierTypes = [
    { id: 'Domestic', name: 'Domestic' },
    { id: 'International', name: 'International' }
  ];

  isLinear = false;
  supplier!: Suppliers;

  value = '';
  filteredStates!: Observable<any>;

  productGroupList!: ProductGroup[];
  countryList!: Country[];
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
  selectedIndex = 0;

  constructor(private fb: FormBuilder, private router: Router, private stateService: StateService, private productGroupService: ProductGroupService, private supplierService: SupplierService,
    private toast: ToastrService, private countryService: CountryService) { }

  ngOnInit(): void {
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
        }
      });

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

  filterStates(name: string) {
    return this.stateList.filter(state =>
      state.Name.toLowerCase().indexOf(name.toLowerCase()) === 0);
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
    this.selectedCountry = event;
    if (event == 'IN') {
      this.basicInfoFrom.controls.gstNumber.setValidators([Validators.required]);
      this.basicInfoFrom.controls.panNumber.setValidators([Validators.required]);
      this.bankDetailsFrom.controls.swiftCode.setValidators(null);
      this.bankDetailsFrom.controls.ifscCode.setValidators([Validators.required]);

    }
    else {
      this.basicInfoFrom.controls.gstNumber.setValidators(null);
      this.basicInfoFrom.controls.panNumber.setValidators(null);
      this.bankDetailsFrom.controls.swiftCode.setValidators([Validators.required]);
      this.bankDetailsFrom.controls.ifscCode.setValidators(null);
    }
    const data = this.countryList.filter(x => x.CountryCode == event).map(y => y.CountryWithCode);
    this.addressForm.get('country')?.setValue(data[0]);
    this.addressForm.get('country')?.disable();
    this.basicInfoFrom.controls.gstNumber.updateValueAndValidity();
    this.basicInfoFrom.controls.panNumber.updateValueAndValidity();
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
    this.selectedIndex = event.selectedIndex;
    const stepLabel = event.selectedStep.label;
    const gstNumber = this.basicInfoFrom.get('gstNumber')?.value;
    if (stepLabel == 'Address') {
      if (gstNumber) {
        this.supplierService.getSupplierByGSTNumber(gstNumber).pipe(
          finalize(() => {
          })
        )
          .subscribe(res => {
            if (res[ResultEnum.IsSuccess]) {
             if(res[ResultEnum.Model]?.length > 0){
              this.selectedIndex= 0;
              this.toast.error(res.Message);
             }
            }
          });
      }
    }
  }

  onClickRegister() {
    const basicInfoForm = this.basicInfoFrom.value;
    const addressForm = this.addressForm.value;
    const stateId = this.stateList.find(x => x.Name === addressForm.state);
    const bankDetailForm = this.bankDetailsFrom.value;
    const supplier = {
      Id: 0,
      FirstName: basicInfoForm.firstName,
      LastName: basicInfoForm.lastName,
      Email: basicInfoForm.emailId,
      Phone: basicInfoForm.telePhone,
      GSTNumber: basicInfoForm.gstNumber,
      PANNumber: basicInfoForm.panNumber,
      ProductGroupId: basicInfoForm.productGroup,
      Country: basicInfoForm.country,
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
      ERPStatus: false,
    } as Suppliers;
    this.supplierService.supplierRegister(supplier).subscribe({
      next: (res: any) => {
        if (res[ResultEnum.IsSuccess]) {
          this.toast.success(res.Message);
          this.basicInfoFrom.reset();
          this.addressForm.reset();
          this.bankDetailsFrom.reset();
          this.router.navigateByUrl('/auth/login');
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
