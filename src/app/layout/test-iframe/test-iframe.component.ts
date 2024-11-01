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
  errorMessage: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      bearerToken: new FormControl('', [Validators.required])
    });
  }

  openIFrame() {
    if (this.form.valid) {
      this.errorMessage = '';
      const url = this.router.createUrlTree(['/paymentMethod']);
      const tokenQueryString = `?token=${this.form.get('bearerToken').value}`;
      this.iFrameSrc = `${window.location.origin}${url.toString()}${tokenQueryString}`;
    } else {
      this.errorMessage = 'Bearer token value is required';
    }
  }
}
