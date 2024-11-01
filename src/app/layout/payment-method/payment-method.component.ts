import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PaymentService } from '../../services/payment/payment.service';
import { ScriptService } from '../../services/script/script-service';

declare const Flex: any; // so we don't get an error when referencing the Flex class in the microform library

@Component({
  selector: 'payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  form: FormGroup;
  microform: any;
  public showError: boolean = false;
  public isLoading: boolean = false;
  public isUserAuthorized: boolean = false;
  public isMicroformScriptLoaded: boolean = false;
  public status: string = 'Authenticating...';
  public captureContext: string;
  public cardNumberValidationError: string;
  public securityCodeValidationError: string;
  public enteredCardNumber: boolean = false;
  public enteredSecurityCode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private renderer: Renderer2,
    private scriptService: ScriptService,
  ) {
    this.form = new FormGroup({
      // cardHolderName: new FormControl('DavidB Testcase', [Validators.required]),
      cardHolderName: new FormControl('', [Validators.required]),
      expiryMonth: new FormControl('12', [Validators.required]),
      expiryYear: new FormControl('2024', [Validators.required])
    });
  }

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      // https://jasonwatmore.com/post/2022/11/08/angular-http-request-error-handling-with-the-httpclient
      this.paymentService.getCaptureContext(token, window.location.origin).subscribe({
        next: (res: any) => {
          this.status = '';
          this.isLoading = false;
          this.isUserAuthorized = true;
          this.captureContext = res.client_token;
          // TODO: use the asset path returned in the captureContext
          const SCRIPT_PATH = 'https://testflex.cybersource.com/microform/bundle/v2.0/flex-microform.min.js';
          const scriptElement = this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
          scriptElement.onload = () => {
            this.renderMicroform();
            this.isMicroformScriptLoaded = true;
          }
          scriptElement.onerror = () => {
            this.status = `Could not load ${SCRIPT_PATH}`;
          }
        }, error: (err: any) => {
          this.isLoading = false;
          this.status = `${err.statusText}, cannot display microform`;
        }
      });
    } else {
      this.status = `Token parameter missing, cannot display microform`;
    }
  }

  renderMicroform() {
    const flex = new Flex(this.captureContext);
    this.microform = flex.microform({
      styles: {
        input: { 'font-size': '1rem' },
        valid: { 'color': 'blue' },
        invalid: { 'color': 'red' },
        ':disabled': { 'cursor': 'not-allowed' }
      }
    });

    const cardNumber = this.microform.createField('number', { placeholder: 'Enter card number' });
    const securityCode = this.microform.createField('securityCode', { placeholder: '•••' });
    const cardSecurityCodeLabel = document.querySelector('label[for=securityCode-container]');
    cardNumber.load('#cardNumber-container');
    securityCode.load('#securityCode-container');
    
    cardNumber.on('change', (data) => {
      this.resetValidationErrors();
      if (data.valid) { // no more input accepted once it's valid
        securityCode.focus();
        this.enteredCardNumber = true;
      }
    });

    securityCode.on('change', (data) => {
      if (data.valid) {
        this.enteredSecurityCode = true;
        this.resetValidationErrors();
      }
    });
  }

  resetValidationErrors() {
    this.cardNumberValidationError = '';
    this.securityCodeValidationError = '';
  }

  allowSubmit() {
    return this.form.valid && this.enteredCardNumber && this.enteredSecurityCode;
  }

  onSubmit() {
    const _self = this;
    if (this.form.valid) {
      let options = {
        expirationMonth: this.form.get('expiryMonth').value,
        expirationYear: this.form.get('expiryYear').value
      };
  
      this.microform.createToken(options, function (err, token) {
        if (err) {
          for (let details of err.details) {
            if (details.location === 'number') {
              _self.cardNumberValidationError = 'valid number is required';
            } else if (details.location === 'securityCode') {
              _self.securityCodeValidationError = 'valid security code is required';
            }
          }
        } else {
          const postData = Object.assign({ nonce: token }, _self.form.value);
          console.log(postData);
          // TODO: POST to addPaymentMethod endpoint
          // TOOD: return list of payment methods on successs
        }
      });
    } else {
      // this.form.markAllAsTouched();
      // return;
    }
  }
}
