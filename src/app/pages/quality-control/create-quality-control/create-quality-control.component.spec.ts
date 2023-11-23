import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQualityControlComponent } from './create-quality-control.component';

describe('CreateQualityControlComponent', () => {
  let component: CreateQualityControlComponent;
  let fixture: ComponentFixture<CreateQualityControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateQualityControlComponent]
    });
    fixture = TestBed.createComponent(CreateQualityControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
