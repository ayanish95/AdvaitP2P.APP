import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovalConfigComponent } from './add-approval-config.component';

describe('AddApprovalConfigComponent', () => {
  let component: AddApprovalConfigComponent;
  let fixture: ComponentFixture<AddApprovalConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddApprovalConfigComponent]
    });
    fixture = TestBed.createComponent(AddApprovalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
