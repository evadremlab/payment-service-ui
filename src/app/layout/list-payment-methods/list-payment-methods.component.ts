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
        if (res?.payment_methods?.length) {
          this.errorMessage = '';
          this.paymentMethods = res.payment_methods;
        } else {
          this.errorMessage = 'No payments found for this user.';
        }
      }, error: (err: any) => {
        this.errorMessage = 'Error getting user profile, token probably expired.';
      }
    });
  }

  formatCreditCardExpirationDate(exp: Date) {
    return moment(exp).format('MM/YY');
  }
}
