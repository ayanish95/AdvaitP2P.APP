import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPurchaseRequisitionListComponent } from './all-purchase-requisition-list.component';

describe('AllPurchaseRequisitionListComponent', () => {
  let component: AllPurchaseRequisitionListComponent;
  let fixture: ComponentFixture<AllPurchaseRequisitionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllPurchaseRequisitionListComponent]
    });
    fixture = TestBed.createComponent(AllPurchaseRequisitionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
