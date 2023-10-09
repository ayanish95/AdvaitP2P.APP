import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSuplierListComponent } from './all-suplier-list.component';

describe('AllSuplierListComponent', () => {
  let component: AllSuplierListComponent;
  let fixture: ComponentFixture<AllSuplierListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllSuplierListComponent]
    });
    fixture = TestBed.createComponent(AllSuplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
