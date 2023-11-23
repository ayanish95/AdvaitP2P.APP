import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAsnListComponent } from './all-asn-list.component';

describe('AllAsnListComponent', () => {
  let component: AllAsnListComponent;
  let fixture: ComponentFixture<AllAsnListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllAsnListComponent]
    });
    fixture = TestBed.createComponent(AllAsnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
