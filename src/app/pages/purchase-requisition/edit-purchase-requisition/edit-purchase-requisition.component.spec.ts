import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPurchaseRequisitionComponent } from './edit-purchase-requisition.component';

describe('EditPurchaseRequisitionComponent', () => {
  let component: EditPurchaseRequisitionComponent;
  let fixture: ComponentFixture<EditPurchaseRequisitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPurchaseRequisitionComponent]
    });
    fixture = TestBed.createComponent(EditPurchaseRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
