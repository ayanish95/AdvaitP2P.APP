import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityControlListComponent } from './quality-control-list.component';

describe('QualityControlListComponent', () => {
  let component: QualityControlListComponent;
  let fixture: ComponentFixture<QualityControlListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QualityControlListComponent]
    });
    fixture = TestBed.createComponent(QualityControlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
