import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchaseRequisitionComponent } from './view-purchase-requisition.component';

describe('ViewPurchaseRequisitionComponent', () => {
  let component: ViewPurchaseRequisitionComponent;
  let fixture: ComponentFixture<ViewPurchaseRequisitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPurchaseRequisitionComponent]
    });
    fixture = TestBed.createComponent(ViewPurchaseRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
