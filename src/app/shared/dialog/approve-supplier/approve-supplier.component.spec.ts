import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSupplierComponent } from './approve-supplier.component';

describe('ApproveSupplierComponent', () => {
  let component: ApproveSupplierComponent;
  let fixture: ComponentFixture<ApproveSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApproveSupplierComponent]
    });
    fixture = TestBed.createComponent(ApproveSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
