import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      'cardHolderName': ['DavidB Testcase', Validators.compose([Validators.required])],
      'expiryMonth': ['12', Validators.compose([Validators.required])],
      'expiryYear': ['2024', Validators.compose([Validators.required])],
    });
  }

  onSubmit() {
    alert(this.form.valid);
  }
}
