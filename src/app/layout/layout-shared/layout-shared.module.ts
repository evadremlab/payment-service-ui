import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

const Modules = [
  ReactiveFormsModule
];

@NgModule({
  imports: [
    CommonModule,
    ...Modules
  ],
  exports: [
    ...Modules
  ]
})
export class LayoutSharedModule { }
