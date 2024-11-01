import { Routes } from '@angular/router';

//components
import { LayoutComponent } from './layout.component';

import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { TestFormComponent } from './test-form/test-form.component';

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
  },
  {
    path: 'test',
    component: LayoutComponent,
    children: [
      {
        path: 'test', component: TestFormComponent,
        data: { title: 'Test Form' }
      },
    ]
  },
];