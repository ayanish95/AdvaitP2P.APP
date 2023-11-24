import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSuplierListComponent } from './view-suplier-list.component';

describe('ViewSuplierListComponent', () => {
  let component: ViewSuplierListComponent;
  let fixture: ComponentFixture<ViewSuplierListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSuplierListComponent]
    });
    fixture = TestBed.createComponent(ViewSuplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
