import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseRequisitionComponent } from './create-purchase-requisition.component';

describe('CreatePurchaseRequisitionComponent', () => {
  let component: CreatePurchaseRequisitionComponent;
  let fixture: ComponentFixture<CreatePurchaseRequisitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePurchaseRequisitionComponent]
    });
    fixture = TestBed.createComponent(CreatePurchaseRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
