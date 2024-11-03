import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-testComponent',
  template: `
    <div class=\"container\">
      <h1>Hello John</h1>
      <input type=\"text\" placeholder=\"Enter text here\" />
    </div>
  `,
  styles: [`
    .container {
      font-size: 24px;
    }
    h1 {
      margin-bottom: 16px;
    }
    input[type=\"text\"] {
      font-size: 24px;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    }
  `]
})
export class TestComponent2 extends CommonExternalComponent {
    // Try updating
}