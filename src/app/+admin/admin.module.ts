import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import {
  DataTableModule,
  DialogModule
} from 'primeng/primeng';

import {AdminRoutingModule} from './admin.routing';
import {AdminComponent}   from './admin.component';
import {AccountComponent} from './account/account.component';
import {PayBalanceComponent} from './balances/balances.component';
import {ShopComponent} from './shop/shop.component';
import {TransactionsComponent} from './transactions/transactions.component';

@NgModule({
  imports: [
  	CommonModule,
    FormsModule,
    AdminRoutingModule,
    DataTableModule,
    DialogModule
  ],
  exports: [],
  declarations: [
    AdminComponent,
    AccountComponent,
    PayBalanceComponent,
    ShopComponent,
    TransactionsComponent,
  ],
  providers: [
  ],
})
export class AdminModule { }
