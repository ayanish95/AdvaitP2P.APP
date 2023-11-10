import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPurchaseOrderListComponent } from './all-purchase-order-list.component';

describe('AllPurchaseOrderListComponent', () => {
  let component: AllPurchaseOrderListComponent;
  let fixture: ComponentFixture<AllPurchaseOrderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllPurchaseOrderListComponent]
    });
    fixture = TestBed.createComponent(AllPurchaseOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
