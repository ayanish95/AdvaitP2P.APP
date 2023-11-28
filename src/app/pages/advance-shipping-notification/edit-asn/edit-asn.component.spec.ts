import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAsnComponent } from './edit-asn.component';

describe('EditAsnComponent', () => {
  let component: EditAsnComponent;
  let fixture: ComponentFixture<EditAsnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAsnComponent]
    });
    fixture = TestBed.createComponent(EditAsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
