import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdvanceShippingNotificationComponent } from './view-advance-shipping-notification.component';

describe('ViewAdvanceShippingNotificationComponent', () => {
  let component: ViewAdvanceShippingNotificationComponent;
  let fixture: ComponentFixture<ViewAdvanceShippingNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAdvanceShippingNotificationComponent]
    });
    fixture = TestBed.createComponent(ViewAdvanceShippingNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
