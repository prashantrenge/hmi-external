// full-calendar.component.ts

import { Component, AfterViewInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

// Import FullCalendar types
import type { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';

/*
  Features:
  - Displays a calendar using FullCalendar.
  - "Calendar" label/title shown above the calendar (centered, bold, Bootstrap 5 styled).
  - Static text "calendar" shown under the title, centered, Bootstrap 5 muted styling.
  - Click on a date to add a note for that day.
  - Notes are saved in local storage and shown as events on the calendar.
  - Static test calendar: Renders some preset static test events at load (not removable by user).
  - Bootstrap 5 styling for modal, buttons, and label.
*/

@Component({
  selector: 'app-full-calendar',
  template: `
    <div class="container mt-4">
      <!-- Calendar label/title -->
      <div class="d-flex justify-content-center align-items-center mb-3">
        <span class="badge bg-primary fs-4 fw-bold px-4 py-2">Calendar</span>
      </div>
      <!-- Static text below the title -->
      <div class="text-center text-muted mb-3 fs-6">calendar</div>
      <div id="calendar" #calendar></div>
    </div>

    <!-- Modal for adding notes -->
    <div class="modal fade" tabindex="-1" [ngClass]="{'show d-block': showModal}" style="background: rgba(0,0,0,0.3);" *ngIf="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Note for {{ selectedDate }}</h5>
            <button type="button" class="btn-close" aria-label="Close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <textarea class="form-control" [(ngModel)]="noteText" rows="4" placeholder="Enter your note..."></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveNote()" [disabled]="!noteText.trim()">Save Note</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #calendar {
      max-width: 900px;
      margin: 0 auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      padding: 16px;
    }
    .modal.show.d-block {
      display: block !important;
    }
  `]
})
export class FullCalendarComponent extends CommonExternalComponent implements AfterViewInit {
  calendar!: any;
  calendarOptions!: CalendarOptions;
  notes: { [date: string]: string } = {};
  showModal: boolean = false;
  selectedDate: string = '';
  noteText: string = '';

  // Static test events (not removable by user)
  readonly staticTestEvents: EventInput[] = [
    { title: 'Test Event A', start: this.getToday(), allDay: true, color: '#ffc107' },
    { title: 'Test Event B', start: this.getOffsetDate(2), allDay: true, color: '#198754' },
    { title: 'Test Event C', start: this.getOffsetDate(-3), allDay: true, color: '#0dcaf0' }
  ];

  constructor() {
    super();
    this.loadNotes();
  }

  override ngAfterViewInit(): void {
    import('@fullcalendar/core').then(core => {
      import('@fullcalendar/daygrid').then(dayGridPlugin => {
        import('@fullcalendar/interaction').then(interactionPlugin => {
          this.calendarOptions = {
            plugins: [dayGridPlugin.default, interactionPlugin.default],
            initialView: 'dayGridMonth',
            selectable: true,
            select: (info: DateSelectArg) => this.onDateSelect(info),
            events: this.getAllEvents(),
            eventClick: (arg: any) => this.onEventClick(arg)
          };
          const calendarEl: HTMLElement | null = document.getElementById('calendar');
          if (calendarEl) {
            this.calendar = new core.Calendar(calendarEl, this.calendarOptions);
            this.calendar.render();
          }
        });
      });
    });
  }

  onDateSelect(info: DateSelectArg): void {
    this.selectedDate = info.startStr;
    this.noteText = this.notes[this.selectedDate] || '';
    this.showModal = true;
  }

  onEventClick(arg: any): void {
    // Only allow editing of user notes, not static test events
    const isStatic = this.staticTestEvents.some(e => e.title === arg.event.title && e.start === arg.event.startStr);
    if (isStatic) return;
    this.selectedDate = arg.event.startStr;
    this.noteText = this.notes[this.selectedDate] || '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.noteText = '';
    this.selectedDate = '';
  }

  saveNote(): void {
    if (this.selectedDate && this.noteText.trim()) {
      this.notes[this.selectedDate] = this.noteText.trim();
      this.persistNotes();
      this.updateCalendarEvents();
    }
    this.closeModal();
  }

  getEvents(): EventInput[] {
    return Object.keys(this.notes).map((date: string) => ({
      title: this.notes[date],
      start: date,
      allDay: true
    }));
  }

  getAllEvents(): EventInput[] {
    // Combine static test events with user notes
    return [...this.staticTestEvents, ...this.getEvents()];
  }

  updateCalendarEvents(): void {
    if (this.calendar) {
      this.calendar.removeAllEvents();
      this.getAllEvents().forEach((event: EventInput) => this.calendar.addEvent(event));
    }
  }

  loadNotes(): void {
    const data: string | null = localStorage.getItem('calendar-notes');
    this.notes = data ? JSON.parse(data) : {};
  }

  persistNotes(): void {
    localStorage.setItem('calendar-notes', JSON.stringify(this.notes));
  }

  // Utility: Today's date in YYYY-MM-DD
  private getToday(): string {
    const today: Date = new Date();
    return today.toISOString().split('T')[0];
  }

  // Utility: Offset days from today (negative for past, positive for future)
  private getOffsetDate(offset: number): string {
    const d: Date = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  }
}