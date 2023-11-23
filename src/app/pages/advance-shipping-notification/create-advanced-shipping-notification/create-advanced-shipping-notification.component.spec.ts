import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdvancedShippingNotificationComponent } from './create-advanced-shipping-notification.component';

describe('CreateAdvancedShippingNotificationComponent', () => {
  let component: CreateAdvancedShippingNotificationComponent;
  let fixture: ComponentFixture<CreateAdvancedShippingNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAdvancedShippingNotificationComponent]
    });
    fixture = TestBed.createComponent(CreateAdvancedShippingNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
