import { Routes } from '@angular/router';

//components
import { LayoutComponent } from './layout.component';

import { PaymentMethodComponent } from './payment-method/payment-method.component';

export const LayoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'paymentMethod', component: PaymentMethodComponent,
        data: { title: 'Payment Method' }
      },
    ]
  }
];