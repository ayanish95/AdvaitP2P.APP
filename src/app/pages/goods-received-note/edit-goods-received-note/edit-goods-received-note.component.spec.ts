import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGoodsReceivedNoteComponent } from './edit-goods-received-note.component';

describe('EditGoodsReceivedNoteComponent', () => {
  let component: EditGoodsReceivedNoteComponent;
  let fixture: ComponentFixture<EditGoodsReceivedNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditGoodsReceivedNoteComponent]
    });
    fixture = TestBed.createComponent(EditGoodsReceivedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
