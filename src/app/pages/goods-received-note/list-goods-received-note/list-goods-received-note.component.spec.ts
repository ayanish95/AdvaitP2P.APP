import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGoodsReceivedNoteComponent } from './list-goods-received-note.component';

describe('ListGoodsReceivedNoteComponent', () => {
  let component: ListGoodsReceivedNoteComponent;
  let fixture: ComponentFixture<ListGoodsReceivedNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListGoodsReceivedNoteComponent]
    });
    fixture = TestBed.createComponent(ListGoodsReceivedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
