import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResultEnum } from '@core/enums/result-enum';
import { Suppliers } from '@core/models/suppliers';
import { SupplierService } from '@core/services/supplier.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-approve-supplier',
  templateUrl: './approve-supplier.component.html',
  styleUrls: ['./approve-supplier.component.scss']
})
export class ApproveSupplierComponent implements OnInit {
  supplierForm = this.fb.group(
    {
      firstName: [{value:'',disabled:true}, [Validators.required]],
      lastName: [{value:'',disabled:true}, [Validators.required]],
      phone: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      gstNumber: [{value:'',disabled:true}],
      panNumber: [{value:'',disabled:true}],
      taxNumber: [{value:'',disabled:true}],
      // productGroup: ['', [Validators.required]],
      street1: [{value:'',disabled:true}, [Validators.required]],
      street2: [{value:'',disabled:true}],
      postalcode: [{value:'',disabled:true}, [Validators.required]],
      city: [{value:'',disabled:true}, [Validators.required]],
      state: [{value:'',disabled:true}, [Validators.required]],
      country: [{value:'',disabled:true}, [Validators.required]],
    }
  );
  bankDetailsFrom = this.fb.nonNullable.group(
    {
      bankCountry: ['', [Validators.required]],
      ifscCode: [''],
      swiftCode: [''],
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      accountHolderName: ['', [Validators.required]],
      remarks: [{value:'',disabled:true}],
      // suppplierAccountGroup: ['', [Validators.required]],
      // compoanyCode: ['', [Validators.required]],
    }
  );

  supplier!: Suppliers;
  selectedIndex: number = 0;
  isLinear = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,private supplierService:SupplierService,private toast: ToastrService,
  private dialogRef: MatDialogRef<ApproveSupplierComponent>) {

  }

  ngOnInit(): void {
    this.supplier = this.data?.supplier
    if (this.supplier) {
      this.supplierForm.setValue({
        firstName: this.trimFormValue(this.supplier.FirstName),
        lastName: this.trimFormValue(this.supplier.LastName),
        phone: this.trimFormValue(this.supplier.Phone),
        emailId: this.trimFormValue(this.supplier.Email),
        gstNumber: this.trimFormValue(this.supplier.GSTNumber),
        panNumber: this.trimFormValue(this.supplier.PANNumber),
        taxNumber: this.trimFormValue(this.supplier.TaxNumber),
        street1: this.trimFormValue(this.supplier.Street1),
        street2: this.trimFormValue(this.supplier.Street2),
        city: this.trimFormValue(this.supplier.City),
        postalcode: this.trimFormValue(this.supplier.PostalCode),
        state: this.trimFormValue(this.supplier.State),
        country: this.trimFormValue(this.supplier.Country),
      });
      this.bankDetailsFrom.setValue({
        bankCountry: this.trimFormValue(this.supplier.BankName),
        ifscCode: this.trimFormValue(this.supplier.IFSCCode),
        swiftCode: this.trimFormValue(this.supplier.SwiftCode),
        bankName: this.trimFormValue(this.supplier.BankName),
        accountNumber: this.trimFormValue(this.supplier.AccountNumber),
        accountHolderName: this.trimFormValue(this.supplier.AccountHolderName),
        remarks: this.trimFormValue(this.supplier.Remarks)
      })
    }
  }

  trimFormValue(value: any) {
    if (value)
      return value;
    else
      return ''
  }

  nextOrPrevious(type: string) {
    if (type == 'next')
      this.selectedIndex = 1;
    else
      this.selectedIndex = 0;
  }
  confirm() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: this.supplier })
  }
}
