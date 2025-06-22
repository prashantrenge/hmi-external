import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

// Feature Summary:
// - Displays a calendar using FullCalendar.
// - On selecting a date, opens a modal to add a note for that date.
// - Notes are stored in local storage and shown as events on the calendar.
// - Bootstrap 5 used for styling.

@Component({
  selector: 'app-test-calendar',
  template: `
    <div class="container mt-4">
      <h2 class="mb-3">Notes Calendar</h2>
      <div id="calendar" class="mb-4"></div>

      <!-- Modal for adding note -->
      <div class="modal fade" tabindex="-1" [ngClass]="{'show d-block': showModal}" style="background:rgba(0,0,0,0.5);" *ngIf="showModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Note for {{ selectedDate }}</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <textarea class="form-control" [(ngModel)]="noteText" rows="3" placeholder="Enter your note"></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="saveNote()">Save Note</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #calendar {
      background: #fff;
      border-radius: .5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
      padding: 1rem;
    }
    .modal.show.d-block {
      display: block;
    }
  `]
})
export class TestCalendarComponent extends CommonExternalComponent {
  notes: Record<string, string[]> = {};
  showModal: boolean = false;
  selectedDate: string = '';
  noteText: string = '';

  calendar: any;

  constructor() {
    super();
    this.loadNotes();
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    import('fullcalendar/main').then((FullCalendar) => {
      const calendarEl = document.getElementById('calendar');
      this.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        events: this.getEvents(),
        select: (info: any) => this.onDateSelect(info),
        eventClick: (info: any) => this.onEventClick(info)
      });
      this.calendar.render();
    });
  }

  loadNotes(): void {
    const data = localStorage.getItem('test-calendar-notes');
    this.notes = data ? JSON.parse(data) : {};
  }

  saveNotes(): void {
    localStorage.setItem('test-calendar-notes', JSON.stringify(this.notes));
  }

  getEvents(): any[] {
    const events: any[] = [];
    for (const date in this.notes) {
      if (Object.prototype.hasOwnProperty.call(this.notes, date)) {
        this.notes[date].forEach((note: string, idx: number) => {
          events.push({
            title: note,
            start: date,
            allDay: true
          });
        });
      }
    }
    return events;
  }

  onDateSelect(info: any): void {
    this.selectedDate = info.startStr;
    this.noteText = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedDate = '';
    this.noteText = '';
    if (this.calendar) {
      this.calendar.unselect();
    }
  }

  saveNote(): void {
    if (!this.selectedDate || !this.noteText.trim()) {
      return;
    }
    if (!this.notes[this.selectedDate]) {
      this.notes[this.selectedDate] = [];
    }
    this.notes[this.selectedDate].push(this.noteText.trim());
    this.saveNotes();
    this.refreshCalendarEvents();
    this.closeModal();
  }

  refreshCalendarEvents(): void {
    if (this.calendar) {
      this.calendar.removeAllEvents();
      this.getEvents().forEach(event => {
        this.calendar.addEvent(event);
      });
    }
  }

  onEventClick(info: any): void {
    // Optionally implement viewing/editing/deleting notes on event click.
  }
}