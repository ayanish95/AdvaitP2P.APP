import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRecordFoundComponent } from './no-record-found.component';

describe('NoRecordFoundComponent', () => {
  let component: NoRecordFoundComponent;
  let fixture: ComponentFixture<NoRecordFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoRecordFoundComponent]
    });
    fixture = TestBed.createComponent(NoRecordFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
