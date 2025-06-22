import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

// Features:
// - EMI label prominently displayed at the top (as "EMI").
// - Monthly reminder creation with title, description, and date.
// - Full calendar view to display reminders.
// - Reminders stored in local storage by default.
// - Uses Bootstrap 5 for styling.
// - Strict type checking for all variables.

interface EmiReminder {
  id: string;
  title: string;
  description: string;
  date: string; // ISO format (YYYY-MM-DD)
}

@Component({
  selector: 'app-emi',
  template: `
    <div class="container py-4">
      <!-- EMI Label (Prominent) -->
      <div class="d-flex align-items-center mb-3">
        <span class="badge bg-primary fs-5 px-4 py-2 me-2">EMI</span>
        <h2 class="mb-0">Monthly Reminder</h2>
      </div>

      <!-- EMI Label Below Title (as per request) -->
      <div class="mb-3">
        <span class="badge bg-info text-dark fs-6 px-3 py-1">lebel emi</span>
      </div>

      <form (ngSubmit)="addReminder()" #reminderForm="ngForm" class="row g-3 mb-4">
        <div class="col-md-4">
          <input type="text" class="form-control" placeholder="Title" name="title" [(ngModel)]="newReminder.title" required maxlength="50">
        </div>
        <div class="col-md-4">
          <input type="date" class="form-control" name="date" [(ngModel)]="newReminder.date" required>
        </div>
        <div class="col-md-4">
          <input type="text" class="form-control" placeholder="Description" name="description" [(ngModel)]="newReminder.description" maxlength="100">
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary" [disabled]="!reminderForm.form.valid">Add Reminder</button>
        </div>
      </form>

      <div class="mb-4">
        <h5>Reminders List</h5>
        <ul class="list-group">
          <li *ngFor="let r of reminders" class="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>{{ r.title }}</strong> ({{ r.date }}): {{ r.description }}
            </span>
            <button class="btn btn-sm btn-danger" (click)="deleteReminder(r.id)">Delete</button>
          </li>
        </ul>
      </div>

      <div>
        <h5>Calendar View</h5>
        <div class="table-responsive">
          <table class="table table-bordered text-center align-middle">
            <thead>
              <tr>
                <th *ngFor="let day of weekDays">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let week of calendar">
                <td *ngFor="let day of week" [class.bg-primary-subtle]="hasReminder(day.fullDate)">
                  <div *ngIf="day.day">
                    <span>{{ day.day }}</span>
                    <div *ngIf="hasReminder(day.fullDate)" class="badge bg-success mt-1">
                      {{ getRemindersCount(day.fullDate) }} Reminder(s)
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-between mt-2">
          <button class="btn btn-outline-secondary btn-sm" (click)="prevMonth()">&lt; Prev</button>
          <span class="fw-bold">{{ months[currentMonth] }} {{ currentYear }}</span>
          <button class="btn btn-outline-secondary btn-sm" (click)="nextMonth()">Next &gt;</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-primary-subtle {
      background-color: #e7f1ff !important;
    }
    .table td {
      min-width: 80px;
      height: 70px;
      vertical-align: top;
    }
  `]
})
export class EmiComponent extends CommonExternalComponent {
  newReminder: EmiReminder = { id: '', title: '', description: '', date: '' };
  reminders: EmiReminder[] = [];

  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  calendar: { day: number | null, fullDate: string }[][] = [];

  constructor() {
    super();
    this.loadReminders();
    this.generateCalendar();
  }

  addReminder(): void {
    if (!this.newReminder.title || !this.newReminder.date) return;
    const reminder: EmiReminder = {
      ...this.newReminder,
      id: crypto.randomUUID()
    };
    this.reminders.push(reminder);
    this.saveReminders();
    this.newReminder = { id: '', title: '', description: '', date: '' };
    this.generateCalendar();
  }

  deleteReminder(id: string): void {
    this.reminders = this.reminders.filter((r: EmiReminder) => r.id !== id);
    this.saveReminders();
    this.generateCalendar();
  }

  saveReminders(): void {
    localStorage.setItem('emi_reminders', JSON.stringify(this.reminders));
  }

  loadReminders(): void {
    const data: string | null = localStorage.getItem('emi_reminders');
    this.reminders = data ? JSON.parse(data) : [];
  }

  hasReminder(date: string): boolean {
    return this.reminders.some((r: EmiReminder) => r.date === date);
  }

  getRemindersCount(date: string): number {
    return this.reminders.filter((r: EmiReminder) => r.date === date).length;
  }

  generateCalendar(): void {
    const firstDay: Date = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay: Date = new Date(this.currentYear, this.currentMonth + 1, 0);

    const weeks: { day: number | null, fullDate: string }[][] = [];
    let week: { day: number | null, fullDate: string }[] = [];

    for (let i = 0; i < 42; i++) {
      const dayNum: number = i - firstDay.getDay() + 1;
      let day: number | null = null;
      let fullDate: string = '';
      if (dayNum > 0 && dayNum <= lastDay.getDate()) {
        day = dayNum;
        const monthStr: string = String(this.currentMonth + 1).padStart(2, '0');
        const dayStr: string = String(day).padStart(2, '0');
        fullDate = `${this.currentYear}-${monthStr}-${dayStr}`;
      }
      week.push({ day, fullDate });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    this.calendar = weeks;
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }
}