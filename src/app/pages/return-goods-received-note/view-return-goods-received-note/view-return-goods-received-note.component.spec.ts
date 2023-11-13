import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReturnGoodsReceivedNoteComponent } from './view-return-goods-received-note.component';

describe('ViewReturnGoodsReceivedNoteComponent', () => {
  let component: ViewReturnGoodsReceivedNoteComponent;
  let fixture: ComponentFixture<ViewReturnGoodsReceivedNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewReturnGoodsReceivedNoteComponent]
    });
    fixture = TestBed.createComponent(ViewReturnGoodsReceivedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
