import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalConfigComponent } from './approval-config.component';

describe('ApprovalConfigComponent', () => {
  let component: ApprovalConfigComponent;
  let fixture: ComponentFixture<ApprovalConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalConfigComponent]
    });
    fixture = TestBed.createComponent(ApprovalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
