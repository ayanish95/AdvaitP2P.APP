import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGoodsReceivedNoteComponent } from './view-goods-received-note.component';

describe('ViewGoodsReceivedNoteComponent', () => {
  let component: ViewGoodsReceivedNoteComponent;
  let fixture: ComponentFixture<ViewGoodsReceivedNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewGoodsReceivedNoteComponent]
    });
    fixture = TestBed.createComponent(ViewGoodsReceivedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
