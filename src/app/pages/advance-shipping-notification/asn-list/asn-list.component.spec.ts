import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsnListComponent } from './asn-list.component';

describe('AsnListComponent', () => {
  let component: AsnListComponent;
  let fixture: ComponentFixture<AsnListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsnListComponent]
    });
    fixture = TestBed.createComponent(AsnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
