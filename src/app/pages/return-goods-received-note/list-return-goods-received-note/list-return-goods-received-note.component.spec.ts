import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReturnGoodsReceivedNoteComponent } from './list-return-goods-received-note.component';

describe('ListReturnGoodsReceivedNoteComponent', () => {
  let component: ListReturnGoodsReceivedNoteComponent;
  let fixture: ComponentFixture<ListReturnGoodsReceivedNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListReturnGoodsReceivedNoteComponent]
    });
    fixture = TestBed.createComponent(ListReturnGoodsReceivedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
