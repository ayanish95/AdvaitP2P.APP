import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovalStrategyComponent } from './add-approval-strategy.component';

describe('AddApprovalStrategyComponent', () => {
  let component: AddApprovalStrategyComponent;
  let fixture: ComponentFixture<AddApprovalStrategyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddApprovalStrategyComponent]
    });
    fixture = TestBed.createComponent(AddApprovalStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
