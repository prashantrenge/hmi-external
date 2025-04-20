import { Component } from '@angular/core';

interface TodoItem {
  text: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  reminderMinutes?: number | null;
}

@Component({
  selector: 'app-shakti',
  template: `
    <div style="max-width:400px;margin:auto;padding:1.5rem;background:#fff;border-radius:8px;box-shadow:0 2px 8px #eee;">
      <h2 style="text-align:center;color:#6c3483;">Daily To-Do List</h2>
      <form (ngSubmit)="addTodo()" style="display:flex;gap:8px;align-items:center;margin-bottom:1rem;flex-wrap:wrap;">
        <input
          type="text"
          [(ngModel)]="newTodoText"
          name="todoText"
          placeholder="Add a new task..."
          required
          style="flex:2 1 120px;padding:6px 10px;border:1px solid #ccc;border-radius:4px;"
        />
        <select
          [(ngModel)]="newTodoPriority"
          name="todoPriority"
          required
          style="flex:1 1 70px;padding:6px 8px;border:1px solid #ccc;border-radius:4px;"
        >
          <option value="" disabled selected>Priority</option>
          <option *ngFor="let p of priorities" [value]="p">{{p}}</option>
        </select>
        <select
          [(ngModel)]="newTodoReminder"
          name="todoReminder"
          style="flex:1 1 90px;padding:6px 8px;border:1px solid #ccc;border-radius:4px;width:90px;"
        >
          <option [ngValue]="null">No reminder</option>
          <option *ngFor="let min of reminderOptions" [ngValue]="min">{{min}} min</option>
        </select>
        <button
          type="submit"
          style="padding:7px 15px;background:#6c3483;color:#fff;border:none;border-radius:4px;cursor:pointer;"
        >Add</button>
      </form>
      <ul style="list-style:none;padding:0;margin:0;">
        <li *ngFor="let todo of sortedTodos(); let i = index"
            [style.opacity]="todo.completed ? 0.5 : 1"
            style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;">
          <span style="display:flex;align-items:center;gap:8px;">
            <input type="checkbox" [(ngModel)]="todo.completed" (change)="toggleComplete(i)" />
            <span [style.textDecoration]="todo.completed ? 'line-through' : 'none'">
              {{todo.text}}
            </span>
            <span
              [ngStyle]="{
                background: getPriorityColor(todo.priority),
                color:'#fff',
                padding:'2px 8px',
                borderRadius:'12px',
                fontSize:'12px'
              }"
            >{{todo.priority}}</span>
            <span *ngIf="todo.reminderMinutes"
                  style="background:#5dade2;color:#fff;padding:2px 8px;border-radius:12px;font-size:12px;">
              ⏰ {{todo.reminderMinutes}} min
            </span>
          </span>
          <button
            (click)="removeTodo(i)"
            style="background:none;border:none;color:#e74c3c;font-size:18px;cursor:pointer;"
            title="Delete"
          >&times;</button>
        </li>
      </ul>
      <div *ngIf="todos.length === 0" style="text-align:center;color:#aaa;margin-top:1rem;">
        No tasks for today!
      </div>
    </div>
  `,
  styles: []
})
export class ShaktiComponent {
  newTodoText: string = '';
  newTodoPriority: 'High' | 'Medium' | 'Low' | '' = '';
  newTodoReminder: number | null = null;

  priorities: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
  reminderOptions: number[] = [5, 10, 15, 30, 60];

  todos: TodoItem[] = [];

  addTodo() {
    if (!this.newTodoText.trim() || !this.newTodoPriority) return;
    this.todos.push({
      text: this.newTodoText,
      priority: this.newTodoPriority as 'High' | 'Medium' | 'Low',
      completed: false,
      reminderMinutes: this.newTodoReminder
    });
    this.newTodoText = '';
    this.newTodoPriority = '';
    this.newTodoReminder = null;
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
  }

  toggleComplete(index: number) {
    this.todos[index].completed = !this.todos[index].completed;
  }

  sortedTodos(): TodoItem[] {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return this.todos.slice().sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  getPriorityColor(priority: 'High' | 'Medium' | 'Low') {
    switch (priority) {
      case 'High': return '#e74c3c';
      case 'Medium': return '#f39c12';
      case 'Low': return '#27ae60';
      default: return '#bdc3c7';
    }
  }
}