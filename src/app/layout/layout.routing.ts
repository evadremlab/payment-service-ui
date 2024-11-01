import { Routes } from '@angular/router';

//components
import { LayoutComponent } from './layout.component';

import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { TestFormComponent } from './test-form/test-form.component';
import { TestIFrameComponent } from './test-iframe/test-iframe.component';

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
    path: 'iframe',
    component: TestIFrameComponent,
  },
];