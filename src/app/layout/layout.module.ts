import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//modules
import { OnlynumberDirective } from '../shared/directives/onlynumber.directive';

//routing
import { LayoutRoutes } from "./layout.routing";

//components
import { LayoutComponent } from './layout.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LayoutRoutes),
  ],
  declarations: [
    LayoutComponent,
    PaymentMethodComponent,
    OnlynumberDirective,
  ],
  entryComponents: [
  ],
  providers: [],
})
export class LayoutModule { }
