import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSuplierListComponent } from './reject-suplier-list.component';

describe('RejectSuplierListComponent', () => {
  let component: RejectSuplierListComponent;
  let fixture: ComponentFixture<RejectSuplierListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectSuplierListComponent]
    });
    fixture = TestBed.createComponent(RejectSuplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
