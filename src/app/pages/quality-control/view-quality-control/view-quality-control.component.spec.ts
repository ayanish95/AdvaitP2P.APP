import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQualityControlComponent } from './view-quality-control.component';

describe('ViewQualityControlComponent', () => {
  let component: ViewQualityControlComponent;
  let fixture: ComponentFixture<ViewQualityControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewQualityControlComponent]
    });
    fixture = TestBed.createComponent(ViewQualityControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
