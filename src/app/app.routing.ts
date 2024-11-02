import { Routes } from '@angular/router';

//components layout and session
import { NotFoundComponent } from './not-found/not-found.component';
import { TestIFrameComponent } from './layout/test-iframe/test-iframe.component';
import { AddPaymentMethodComponent } from './layout/add-payment-method/add-payment-method.component';
import { ListPaymentMethodsComponent } from './layout/list-payment-methods/list-payment-methods.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'iframe', pathMatch: 'full' },
  { path: 'iframe', component: TestIFrameComponent },
  { path: 'addPaymentMethod', component: AddPaymentMethodComponent },
  { path: 'listPaymentMethods/:token', component: ListPaymentMethodsComponent },
  {
    path: '**',
    component: NotFoundComponent
  }
];
