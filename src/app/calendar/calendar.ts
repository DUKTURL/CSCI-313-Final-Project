import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {

  router = inject(Router);

  // current date state
  currentDate = signal(new Date());

  days: (number | null)[] = [];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const date = this.currentDate();

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0–6
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const temp: (number | null)[] = [];

    // empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      temp.push(null);
    }

    // actual days
    for (let d = 1; d <= daysInMonth; d++) {
      temp.push(d);
    }

    // empty slots after last day
    while (temp.length % 7 !== 0) {
      temp.push(null);
    }

    this.days = temp;
  }

  prevMonth() {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    this.generateCalendar();
  }

  nextMonth() {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
    this.generateCalendar();
  }

  go(day: number | null) {
    if (!day) return;

    const date = this.currentDate();
    const formatted = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    this.router.navigate(['day', formatted]);
  }

  get monthYear() {
    return this.currentDate().toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
  }

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}
