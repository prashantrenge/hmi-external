// calendar.component.ts

import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  template: `
    <!-- 
      Features:
      - Displays a calendar using FullCalendar (day grid view)
      - User can select a date to add/view/edit/delete notes for that date
      - Notes are stored in local storage and persist between reloads
      - Uses Bootstrap 5 for modals and layout
    -->
    <div class="container my-4">
      <div class="row">
        <div class="col-12">
          <full-calendar
            [options]="calendarOptions"
            class="mb-3"
          ></full-calendar>
        </div>
      </div>

      <!-- Modal for adding/editing note -->
      <div class="modal fade" tabindex="-1" [ngClass]="{'show d-block': showModal}" style="background: rgba(0,0,0,0.5);" *ngIf="showModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Note for {{ selectedDate }}</h5>
              <button type="button" class="btn-close" aria-label="Close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <textarea class="form-control" [(ngModel)]="noteText" rows="5" placeholder="Enter your note..."></textarea>
            </div>
            <div class="modal-footer">
              <button class="btn btn-danger me-auto" *ngIf="noteExists" (click)="deleteNote()">Delete</button>
              <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button class="btn btn-primary" (click)="saveNote()">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fc {
      background: #fff;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 1rem;
    }
    .modal.show.d-block {
      display: block;
    }
  `]
})
export class CalendarComponent extends CommonExternalComponent {
  calendarOptions: CalendarOptions;
  showModal: boolean = false;
  selectedDate: string = '';
  noteText: string = '';
  noteExists: boolean = false;

  private readonly STORAGE_KEY: string = 'calendar-notes';

  constructor() {
    super();
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      selectMirror: true,
      events: this.getNotesAsEvents(),
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      height: 'auto'
    };
  }

  // Handle selecting a date on the calendar
  handleDateSelect(selectInfo: DateSelectArg): void {
    const dateStr: string = selectInfo.startStr;
    this.selectedDate = dateStr;
    this.noteText = this.getNoteForDate(dateStr) || '';
    this.noteExists = !!this.noteText;
    this.showModal = true;
  }

  // Handle clicking an event (note)
  handleEventClick(clickInfo: any): void {
    const dateStr: string = clickInfo.event.startStr;
    this.selectedDate = dateStr;
    this.noteText = this.getNoteForDate(dateStr) || '';
    this.noteExists = !!this.noteText;
    this.showModal = true;
  }

  // Save note to local storage and update calendar events
  saveNote(): void {
    if (this.noteText.trim()) {
      const notes: Record<string, string> = this.getAllNotes();
      notes[this.selectedDate] = this.noteText.trim();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    }
    this.updateCalendarEvents();
    this.closeModal();
  }

  // Delete note for selected date
  deleteNote(): void {
    const notes: Record<string, string> = this.getAllNotes();
    delete notes[this.selectedDate];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    this.updateCalendarEvents();
    this.closeModal();
  }

  // Close modal dialog
  closeModal(): void {
    this.showModal = false;
    this.noteText = '';
    this.selectedDate = '';
    this.noteExists = false;
  }

  // Get all notes from local storage
  getAllNotes(): Record<string, string> {
    const data: string | null = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) as Record<string, string> : {};
  }

  // Get note for specific date
  getNoteForDate(date: string): string | undefined {
    const notes: Record<string, string> = this.getAllNotes();
    return notes[date];
  }

  // Convert notes to FullCalendar events
  getNotesAsEvents(): EventInput[] {
    const notes: Record<string, string> = this.getAllNotes();
    return Object.entries(notes).map(([date, note]) => ({
      title: note.length > 20 ? note.substring(0, 20) + '...' : note,
      start: date,
      allDay: true,
      backgroundColor: '#0d6efd',
      borderColor: '#0d6efd',
      textColor: '#fff'
    }));
  }

  // Refresh calendar events
  updateCalendarEvents(): void {
    this.calendarOptions.events = this.getNotesAsEvents();
  }
}