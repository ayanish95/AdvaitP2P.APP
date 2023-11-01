import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { ListQuotationComponent } from './list-quotation/list-quotation.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
    declarations: [
        ListQuotationComponent
    ],
    imports: [
        CommonModule,
        QuotationRoutingModule,
        SharedModule
    ]
})
export class QuotationModule { }
