import { Routes } from '@angular/router';

//components layout and session
import { NotFoundComponent } from './not-found/not-found.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'paymentMethod', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
