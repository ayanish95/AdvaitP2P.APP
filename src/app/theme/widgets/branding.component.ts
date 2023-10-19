import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="d-inline-block text-nowrap r-full text-reset" href="/">
      <img src="./assets/images/logo.png" class="brand-logo align-middle m-2 " alt="logo" />
      <span class="align-middle f-s-16 f-w-500 m-x-8">P2P Portal</span>
    </a>
  `,
  styles: [
    `
      .brand-logo {
        width: 120px;
        height: 39px;
      }
    `,
  ],
})
export class BrandingComponent {}
