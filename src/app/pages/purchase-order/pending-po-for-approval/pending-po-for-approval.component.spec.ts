import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPOForApprovalComponent } from './pending-po-for-approval.component';

describe('PendingForApprovalComponent', () => {
  let component: PendingPOForApprovalComponent;
  let fixture: ComponentFixture<PendingPOForApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingPOForApprovalComponent]
    });
    fixture = TestBed.createComponent(PendingPOForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
