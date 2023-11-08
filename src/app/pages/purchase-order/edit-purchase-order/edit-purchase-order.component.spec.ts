import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPurchaseOrderComponent } from './edit-purchase-order.component';

describe('EditPurchaseOrderComponent', () => {
  let component: EditPurchaseOrderComponent;
  let fixture: ComponentFixture<EditPurchaseOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPurchaseOrderComponent]
    });
    fixture = TestBed.createComponent(EditPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
