import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGoodsReceivedNoteComponent } from './create-goods-received-note.component';

describe('CreateGoodsReceivedNoteComponent', () => {
  let component: CreateGoodsReceivedNoteComponent;
  let fixture: ComponentFixture<CreateGoodsReceivedNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateGoodsReceivedNoteComponent]
    });
    fixture = TestBed.createComponent(CreateGoodsReceivedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
