import { NgModule } from '@angular/core';

import { LoaderService } from './common/loader-service';
import { UiService } from './common/ui-service';

@NgModule({
    imports: [],
    exports: [],
    providers: [
        LoaderService,
        UiService
    ],
})
export class ServiceModule {

}
