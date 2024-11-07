import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-iframe',
  templateUrl: './test-iframe.component.html',
  styleUrls: ['./test-iframe.component.css']
})
export class TestIFrameComponent implements OnInit {
  form: FormGroup;
  iFrameSrc: string;
  bearerToken: string;
  errorMessage: string;
  addedPaymentMethod: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      bearerToken: new FormControl('', [Validators.required])
    });
    // wait for successful payment method creation
    window.addEventListener('message', this.paymentMethodAdded);
  }

  paymentMethodAdded(evt: MessageEvent) {
    // Make sure the message is from the correct origin
    if (evt.origin === window.location.origin) {
      let paymentMethod = evt?.data?.paymentMethod;
      if (paymentMethod) {
        this.addedPaymentMethod = true;
        window.removeEventListener('message', this.paymentMethodAdded);
        this.router.navigate([`/listPaymentMethods/${this.bearerToken}`]);
      }
    }
  }

  isIFrameVisible() {
    return this.addedPaymentMethod ? false : this.iFrameSrc;
  }

  openIFrame() {
    if (this.form.valid) {
      this.errorMessage = '';
      this.bearerToken = this.form.get('bearerToken').value;
      const url = this.router.createUrlTree(['/addPaymentMethod']);
      this.iFrameSrc = `${window.location.origin}${url.toString()}/${this.bearerToken}`;
    } else {
      this.errorMessage = 'Bearer token value is required';
    }
  }
}
