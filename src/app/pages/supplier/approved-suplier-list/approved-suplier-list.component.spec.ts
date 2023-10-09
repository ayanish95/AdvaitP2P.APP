import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedSuplierListComponent } from './approved-suplier-list.component';

describe('ApprovedSuplierListComponent', () => {
  let component: ApprovedSuplierListComponent;
  let fixture: ComponentFixture<ApprovedSuplierListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedSuplierListComponent]
    });
    fixture = TestBed.createComponent(ApprovedSuplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
