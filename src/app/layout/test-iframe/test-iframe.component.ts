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
    window.addEventListener('message', (evt: MessageEvent) => {
      // Make sure the messages come from the correct origin
      if (evt.origin === window.location.origin) {
        let paymentMethod = evt?.data?.paymentMethod;
        if (paymentMethod) {
          this.addedPaymentMethod = true;
          this.router.navigate([`/listPaymentMethods/${this.bearerToken}`]);
        }
      }
    });
  }

  isIFrameVisible() {
    return this.addedPaymentMethod ? false : this.iFrameSrc;
  }

  openIFrame() {
    if (this.form.valid) {
      this.errorMessage = '';
      this.bearerToken = this.form.get('bearerToken').value;
      const url = this.router.createUrlTree(['/addPaymentMethod']);
      const tokenQueryString = `?token=${this.bearerToken}`;
      this.iFrameSrc = `${window.location.origin}${url.toString()}${tokenQueryString}`;
    } else {
      this.errorMessage = 'Bearer token value is required';
    }
  }
}
