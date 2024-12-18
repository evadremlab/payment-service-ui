import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from '../../shared/models/loader-state';

@Injectable()
export class LoaderService {
  private loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();
  errors = [];
  backGroundUrls: string[] = [];
  constructor() { }

  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }
  hide() {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }
  showErrors(errors: any[]) {
    this.loaderSubject.next(<LoaderState>{ show: false, errors: errors });
    this.errors = errors;
  }
}
