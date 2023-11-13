import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReturnGoodsReceivedNoteComponent } from './create-return-goods-received-note.component';

describe('CreateReturnGoodsReceivedNoteComponent', () => {
  let component: CreateReturnGoodsReceivedNoteComponent;
  let fixture: ComponentFixture<CreateReturnGoodsReceivedNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateReturnGoodsReceivedNoteComponent]
    });
    fixture = TestBed.createComponent(CreateReturnGoodsReceivedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
