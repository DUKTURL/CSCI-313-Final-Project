import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Medication } from '../medication';
import { NgClass } from '@angular/common';
import { UserService } from '../user.service';
type DotColor = 'red' | 'green' | 'grey' | '';

@Component({
  selector: 'app-calendar',
  imports: [RouterLink, NgClass],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
  router = inject(Router);

  medicationService = inject(Medication);
  userService = inject(UserService);

  // current date state
  currentDate = signal(new Date());

  // array of days to display in calendar
  days: (number | null)[] = [];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const date = this.currentDate();
    const medications = this.medicationService.medications();

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

  getDotsForDay(day: number | null): DotColor[] {
    if (!day) return [];
    const DAY_NAMES = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const userId = this.userService.currentUser()?.id;
    const medications = this.medicationService
      .medications()
      .filter((med) => med.user_id === userId);

    const result: DotColor[] = [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const date = this.currentDate();
    const formattedCurrentDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const currentDate = new Date(date.getFullYear(), date.getMonth(), day);

    for (const med of medications) {
      const addedDate = new Date(med.date_added);
      this.userService.currentUser()?.id;
      // only include meds added before or on current date
      if (addedDate >= currentDate) continue;

      // check if med applies to this day
      if (!med.days_to_take.includes(DAY_NAMES[currentDate.getDay()])) continue;

      const taken = med.dates_taken.includes(formattedCurrentDate);
      const nowHour = today.getHours();
      let dot: DotColor = '';

      if (taken) {
        dot = 'green';
      } else if (med.hour > nowHour - 19 && currentDate >= today) {
        dot = 'grey';
      } else {
        dot = 'red';
      }

      result.push(dot);

      // stop if we already have 6 dots
      if (result.length === 6) break;
    }

    // fill remaining slots up to 6
    while (result.length < 6) {
      result.push('');
    }

    return result;
  }

  // buttons to navigate months
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

  // navigate to day view for given day
  go(day: number | null) {
    if (!day) return;

    const date = this.currentDate();
    const formatted = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    this.router.navigate(['day', formatted]);
  }

  // gets current month and year as "Month YYYY"
  get monthYear() {
    return this.currentDate().toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  }

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}
