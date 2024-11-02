import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PaymentService } from '../../services/payment/payment.service';

import * as moment from 'moment';

@Component({
  selector: 'app-list-payment-methods',
  templateUrl: './list-payment-methods.component.html',
  styleUrls: ['./list-payment-methods.component.css']
})
export class ListPaymentMethodsComponent implements OnInit {
  public bearerToken: string;
  public errorMessage: string;
  public paymentMethods: any = [];

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.bearerToken = this.route.snapshot.paramMap.get('token');
    this.paymentService.getUserProfile(this.bearerToken).subscribe({
      next: (res: any) => {
        this.paymentMethods = res?.payment_methods || [];
        this.errorMessage = '';
        // source eg: "American Express"
        // nickname eg: "American Express ending in 4444"
        // credit_card_expiration_date // TODO: need to convert to MM/YY
      }, error: (err: any) => {
        this.errorMessage = err.message;
      }
    });
  }

  formatCreditCardExpirationDate(exp: Date) {
    return moment(exp).format('MM/YY');
  }
}
