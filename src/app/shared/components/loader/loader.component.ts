import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../services/common/loader-service';
import { LoaderState } from '../../../shared/models/loader-state';

@Component({
    selector: 'angular-loader',
    templateUrl: 'loader.component.html',
    styleUrls: ['loader.component.css']
})

export class LoaderComponent implements OnInit {
    show = false;
    private subscription: Subscription;

    constructor(private loaderService: LoaderService) { }

    ngOnInit() {
        this.subscription = this.loaderService.loaderState
            .subscribe((state: LoaderState) => {
                this.show = state.show;
                // if (state.show)
                //     this.spinner.show();
                // else
                //     this.spinner.hide();
            });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
