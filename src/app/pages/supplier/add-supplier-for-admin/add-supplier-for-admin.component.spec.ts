import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierForAdminComponent } from './add-supplier-for-admin.component';

describe('AddSupplierForAdminComponent', () => {
  let component: AddSupplierForAdminComponent;
  let fixture: ComponentFixture<AddSupplierForAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSupplierForAdminComponent]
    });
    fixture = TestBed.createComponent(AddSupplierForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
