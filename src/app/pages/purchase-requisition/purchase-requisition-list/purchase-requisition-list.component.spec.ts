import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequisitionListComponent } from './purchase-requisition-list.component';

describe('PurchaseRequisitionListComponent', () => {
  let component: PurchaseRequisitionListComponent;
  let fixture: ComponentFixture<PurchaseRequisitionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseRequisitionListComponent]
    });
    fixture = TestBed.createComponent(PurchaseRequisitionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
