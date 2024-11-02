import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//shared
import { rootRouterConfig } from './app.routing';

//services
import { ServiceModule } from './services/service.module';
import { PaymentService } from './services/payment/payment.service';
import { ScriptService } from './services/script/script-service';

//components
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { TestIFrameComponent } from './layout/test-iframe/test-iframe.component';
import { AddPaymentMethodComponent } from './layout/add-payment-method/add-payment-method.component';
import { ListPaymentMethodsComponent } from './layout/list-payment-methods/list-payment-methods.component';

//pipes
import { SafePipe } from './shared/pipes/safe.pipe';

//interceptors
import { HttpClientModule } from '@angular/common/http';

//toastr module
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    SafePipe,
    AppComponent,
    NotFoundComponent,
    LoaderComponent,
    TestIFrameComponent,
    AddPaymentMethodComponent,
    ListPaymentMethodsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false, relativeLinkResolution: 'legacy' }),
    HttpClientModule,
    ToastrModule.forRoot({
      tapToDismiss: true,
      positionClass : 'toast-top-right',
      timeOut : 3000,
      preventDuplicates : true,
      progressBar : true,
      progressAnimation : 'increasing'  
    }),
  ],
  providers: [
    PaymentService,
    ScriptService,
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
