import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
   // standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
// import { Component } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { WebcamModule } from 'ngx-webcam';
// import { CheckboxModule } from 'primeng/checkbox';
// @Component({
//     selector: 'app-root',
//     standalone: true,
//     imports: [RouterModule,NgxChartsModule,WebcamModule, RouterModule,
//     NgxChartsModule,
//     WebcamModule,
//     CheckboxModule, // ✅ Needed for p-checkbox
//     ReactiveFormsModule],
//    // declarations: [],
//     template: `<router-outlet></router-outlet>

// `
// })
// export class AppComponent {}
