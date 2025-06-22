// SigmaComponent: Diet Tracker + FullCalendar Integration with Drag-and-Drop Events
// Features:
// - Diet entry form and listing (as before)
// - Integrated FullCalendar inline, showing events per day
// - Drag diet entries to calendar days to create events
// - Remove or move events via drag-and-drop
// - Strict type checking throughout

import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarOptions, EventInput, DateSelectArg, EventDropArg, EventClickArg, FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
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
        <ul #draggableEntries>
          <li *ngFor="let entry of entries; let i = index"
              class="fc-draggable"
              [attr.data-food]="entry.food"
              [attr.data-calories]="entry.calories"
              draggable="true">
            {{ entry.food }} - {{ entry.calories }} kcal
            <button (click)="removeEntry(i)" title="Remove">✕</button>
          </li>
        </ul>
        <div class="total">
          <strong>Total:</strong> {{ totalCalories() }} kcal
        </div>
      </div>
      <div class="calendar-section">
        <h3>Calendar</h3>
        <full-calendar
          #fullcalendar
          [options]="calendarOptions">
        </full-calendar>
      </div>
    </div>
  `,
  styles: [`
    .sigma-diet-tracker {
      max-width: 700px;
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
      cursor: grab;
      user-select: none;
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
    .calendar-section {
      margin-top: 32px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.03);
      padding: 16px;
    }
    ::ng-deep .fc {
      /* Make calendar fit container */
      font-size: 14px;
    }
    ::ng-deep .fc-event {
      background: #2563eb !important;
      border: none !important;
      color: #fff !important;
      padding: 2px 6px;
      border-radius: 3px;
    }
    ::ng-deep .fc-daygrid-day.fc-day-today {
      background: #e0e7ef;
    }
  `]
})
export class SigmaComponent extends CommonExternalComponent {
  dietForm: FormGroup;
  entries: { food: string; calories: number }[] = [];
  calendarEvents: EventInput[] = [];

  @ViewChild('draggableEntries', { static: false }) draggableEntries?: ElementRef<HTMLUListElement>;
  @ViewChild('fullcalendar', { static: false }) fullcalendar?: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    droppable: true,
    selectable: true,
    events: this.calendarEvents,
    eventReceive: this.onEventReceive.bind(this),
    eventDrop: this.onEventDrop.bind(this),
    eventClick: this.onEventClick.bind(this),
    height: 500,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    }
  };

  constructor(private fb: FormBuilder) {
    super();
    this.dietForm = this.fb.group({
      food: ['', Validators.required],
      calories: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngAfterViewInit(): void {
    // Enable external drag for each entry
    if (this.draggableEntries) {
      new Draggable(this.draggableEntries.nativeElement, {
        itemSelector: '.fc-draggable',
        eventData: (el: HTMLElement): EventInput => ({
          title: `${el.getAttribute('data-food') || ''} (${el.getAttribute('data-calories') || ''} kcal)`,
          extendedProps: {
            food: el.getAttribute('data-food') || '',
            calories: Number(el.getAttribute('data-calories')) || 0
          }
        })
      });
    }
  }

  addEntry(): void {
    if (this.dietForm.valid) {
      const food: string = this.dietForm.value.food;
      const calories: number = this.dietForm.value.calories;
      this.entries.push({ food, calories });
      this.dietForm.reset();
    }
  }

  removeEntry(index: number): void {
    this.entries.splice(index, 1);
  }

  totalCalories(): number {
    return this.entries.reduce((sum: number, entry) => sum + entry.calories, 0);
  }

  // Handle drop from external (diet entry) into calendar
  onEventReceive(arg: any): void {
    const event = arg.event;
    // Keep event in calendar
    this.calendarEvents = [
      ...this.calendarEvents,
      {
        id: event.id,
        title: event.title,
        start: event.start,
        allDay: event.allDay,
        extendedProps: event.extendedProps
      }
    ];
    // Optionally: remove from entries after drop
    const droppedFood: string = event.extendedProps?.food ?? '';
    const droppedCalories: number = event.extendedProps?.calories ?? 0;
    const idx: number = this.entries.findIndex(e => e.food === droppedFood && e.calories === droppedCalories);
    if (idx !== -1) {
      this.entries.splice(idx, 1);
    }
  }

  // Allow moving events within the calendar
  onEventDrop(arg: EventDropArg): void {
    // No action needed, as FullCalendar updates event date automatically
  }

  // Click to delete event from calendar
  onEventClick(arg: EventClickArg): void {
    if (confirm('Delete this calendar entry?')) {
      arg.event.remove();
      this.calendarEvents = this.calendarEvents.filter(ev => ev.id !== arg.event.id);
    }
  }
}