import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSuplierListComponent } from './pending-suplier-list.component';

describe('PendingSuplierListComponent', () => {
  let component: PendingSuplierListComponent;
  let fixture: ComponentFixture<PendingSuplierListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingSuplierListComponent]
    });
    fixture = TestBed.createComponent(PendingSuplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
