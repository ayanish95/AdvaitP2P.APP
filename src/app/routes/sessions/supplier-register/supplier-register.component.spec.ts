import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRegisterComponent } from './supplier-register.component';

describe('SupplierRegisterComponent', () => {
  let component: SupplierRegisterComponent;
  let fixture: ComponentFixture<SupplierRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierRegisterComponent]
    });
    fixture = TestBed.createComponent(SupplierRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
