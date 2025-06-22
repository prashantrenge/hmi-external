import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

// Features:
// - Displays a "Reminder" label using Bootstrap styling.
// - Component extends CommonExternalComponent as required.
// - Strict type checking enabled.

@Component({
  selector: 'app-reminder',
  template: `
    <div class="alert alert-primary d-inline-block px-4 py-2 fw-bold">
      Reminder
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin: 1rem 0;
    }
  `]
})
export class ReminderComponent extends CommonExternalComponent {}