import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-sigma',
  template: `
    <div class="sigma-diet-tracker">
      <h2>Diet Tracker</h2>
      <form [formGroup]="dietForm" (ngSubmit)="addEntry()">
        <div class="form-row">
          <input type="text" formControlName="food" placeholder="Food Item" />
          <input type="number" formControlName="calories" placeholder="Calories" min="0" />
          <button type="submit" [disabled]="dietForm.invalid">Add</button>
        </div>
      </form>
      <div *ngIf="entries.length > 0" class="entries">
        <h3>Today's Entries</h3>
        <ul>
          <li *ngFor="let entry of entries; let i = index">
            {{ entry.food }} - {{ entry.calories }} kcal
            <button (click)="removeEntry(i)" title="Remove">✕</button>
          </li>
        </ul>
        <div class="total">
          <strong>Total:</strong> {{ totalCalories() }} kcal
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sigma-diet-tracker {
      max-width: 400px;
      margin: 32px auto;
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      font-family: Arial, sans-serif;
    }
    h2, h3 {
      text-align: center;
      margin-bottom: 16px;
      color: #2d3748;
    }
    form .form-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    input[type="text"], input[type="number"] {
      flex: 1;
      padding: 8px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-size: 14px;
    }
    button[type="submit"] {
      padding: 8px 16px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }
    button[type="submit"]:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }
    .entries ul {
      list-style: none;
      padding: 0;
      margin: 0 0 8px 0;
    }
    .entries li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #e0e7ef;
      margin-bottom: 6px;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 15px;
    }
    .entries button {
      background: transparent;
      border: none;
      color: #ef4444;
      font-size: 18px;
      cursor: pointer;
      line-height: 1;
      padding: 0 4px;
    }
    .total {
      text-align: right;
      font-size: 16px;
      margin-top: 6px;
      color: #334155;
    }
  `]
})
export class SigmaComponent extends CommonExternalComponent {
  dietForm: FormGroup;
  entries: { food: string; calories: number }[] = [];

  constructor(private fb: FormBuilder) {
    super();
    this.dietForm = this.fb.group({
      food: ['', Validators.required],
      calories: [null, [Validators.required, Validators.min(0)]]
    });
  }

  addEntry() {
    if (this.dietForm.valid) {
      this.entries.push({
        food: this.dietForm.value.food,
        calories: this.dietForm.value.calories
      });
      this.dietForm.reset();
    }
  }

  removeEntry(index: number) {
    this.entries.splice(index, 1);
  }

  totalCalories(): number {
    return this.entries.reduce((sum, entry) => sum + entry.calories, 0);
  }
}