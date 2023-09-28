import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';

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
      street1: ['', [Validators.required]],
      street2: ['', [Validators.required]],
      postalcode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      telePhone: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
     
    }
  );
  bankDetailsFrom = this.fb.nonNullable.group(
    {
      bankCountry: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      swiftCode: [''],
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      paytems: [''],
      suppplierAccountGroup: ['', [Validators.required]],
      compoanyCode: ['', [Validators.required]],
    }
  );
  isLinear = false;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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
}
