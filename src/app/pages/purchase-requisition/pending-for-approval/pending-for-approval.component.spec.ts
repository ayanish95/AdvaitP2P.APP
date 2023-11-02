import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingForApprovalComponent } from './pending-for-approval.component';

describe('PendingForApprovalComponent', () => {
  let component: PendingForApprovalComponent;
  let fixture: ComponentFixture<PendingForApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingForApprovalComponent]
    });
    fixture = TestBed.createComponent(PendingForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
