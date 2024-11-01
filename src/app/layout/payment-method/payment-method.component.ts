/**
 * https://developer.cybersource.com/demo/doc/microform_doc.html
 */
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PaymentService } from '../../services/payment/payment.service';
import { ScriptService } from '../../services/script/script-service';

import * as jwt from 'jwt-decode';

declare const Flex: any; // so we don't get an error when referencing the Flex class in the microform library

@Component({
  selector: 'payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  form: FormGroup;
  microform: any;
  expiryYears: Array<number> = [];
  public isLoading: boolean = false;
  public isUserAuthorized: boolean = false;
  public isMicroformScriptLoaded: boolean = false;
  public errorMessage: string;
  public captureContext: string;
  public cardNumberValidationError: string;
  public securityCodeValidationError: string;
  public enteredCardNumber: boolean = false;
  public enteredSecurityCode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private renderer: Renderer2,
    private scriptService: ScriptService,
  ) {
    this.form = new FormGroup({
      zipCode: new FormControl('', [Validators.required]),
      expiryMonth: new FormControl('', [Validators.required]),
      expiryYear: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.populateDefaultFormValues();
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      // https://jasonwatmore.com/post/2022/11/08/angular-http-request-error-handling-with-the-httpclient
      this.paymentService.getCaptureContext(token, window.location.origin).subscribe({
        next: (res: any) => {
          let scriptPath: string;
          this.errorMessage = '';
          this.isLoading = false;
          this.isUserAuthorized = true;
          this.captureContext = res.client_token;
          scriptPath = this.getScriptPath(this.captureContext);
          const scriptElement = this.scriptService.loadJsScript(this.renderer, scriptPath);
          scriptElement.onload = () => {
            this.renderMicroform();
            this.isMicroformScriptLoaded = true;
          }
          scriptElement.onerror = () => {
            this.errorMessage = `Could not load ${scriptPath}`;
          }
        }, error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = `${err.statusText}, cannot display microform`;
        }
      });
    } else {
      this.errorMessage = `Token parameter missing, cannot display microform`;
    }
  }

  /**
   * Default the expiryYear to the current year.
   * Default the expiryMonth to the current month.
   */
  populateDefaultFormValues() {
    let currentYear = (new Date()).getFullYear();
    let currentMonth = (new Date()).getMonth() + 1;
    this.form.get('expiryMonth').setValue(currentMonth);
    this.form.get('expiryYear').setValue(currentYear);
    for (let i = 0; i < 5; i++){
      this.expiryYears.push(currentYear + i);
    }
    // for localhost debugging
    if (window.location.hostname === 'localhost') {
      this.form.get('zipCode').setValue('94501');
    }
  }
  
  /**
   * Get link to microform library from capture context (with default fallback).
   */
  getScriptPath(captureContext) {
    let scriptPath: string = 'https://testflex.cybersource.com/microform/bundle/v2.0/flex-microform.min.js';
    try {
      const decoded = jwt.jwtDecode(captureContext);
      if (decoded) {
        const ctx = decoded['ctx'];
        if (ctx?.length) {
          scriptPath = ctx[0]?.data?.clientLibrary;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      return scriptPath;
    }
  }

  /**
   * Replace the card number and security code placeholders 
   * with iframes hosted by Cybersource, and attach event handlers.
   */
  renderMicroform() {
    const flex = new Flex(this.captureContext);
    this.microform = flex.microform({
      styles: {
        input: { 'font-size': '14px' },
        valid: { 'color': 'blue' },
        invalid: { 'color': 'red' },
        ':disabled': { 'cursor': 'not-allowed' }
      }
    });

    const cardNumber = this.microform.createField('number', { placeholder: 'Enter card number' });
    const securityCode = this.microform.createField('securityCode', { placeholder: '•••' });
    cardNumber.load('#cardNumber-container');
    securityCode.load('#securityCode-container');

    cardNumber.on('change', (data) => {
      this.resetValidationErrors();
      if (!data.empty) {
        this.enteredCardNumber = true;
      }
      if (data.valid) { // no more input accepted once it's valid
        securityCode.focus();
      }
    });

    securityCode.on('change', (data) => {
      if (!data.empty) {
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
        zipCode: this.form.get('zipCode').value,
        expirationMonth: this.form.get('expiryMonth').value,
        expirationYear: this.form.get('expiryYear').value
      };
      this.microform.createToken(options, function (err, token) {
        if (err) {
          for (let details of err.details) {
            if (details.location === 'number') {
              _self.cardNumberValidationError = 'valid number required';
            } else if (details.location === 'securityCode') {
              _self.securityCodeValidationError = 'valid code required';
            }
          }
        } else {
          const postData = Object.assign({ nonce: token }, _self.form.value);
          console.log(postData);
          // TODO: POST to addPaymentMethod endpoint
          // TOOD: return list of payment methods on successs
        }
      });
    }
  }
}
