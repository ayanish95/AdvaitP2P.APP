import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-record-found',
  templateUrl: './no-record-found.component.html',
  styleUrls: ['./no-record-found.component.scss']
})
export class NoRecordFoundComponent implements OnInit {
  @Input() message!:string;
  @Input() columnCount=0 ;

  ngOnInit(): void {
  }

}
