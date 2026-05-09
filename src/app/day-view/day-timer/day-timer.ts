import { Component, computed, input, inject } from '@angular/core';
import { Medication } from '../../medication';
import { UserService } from '../../user.service';
import { MedicationModel } from '../../models/medication-model';


@Component({
  selector: 'app-day-timer',
  imports: [],
  templateUrl: './day-timer.html',
  styleUrl: './day-timer.css',
})
export class DayTimer {
  date = input.required<string>();
  medicationService = inject(Medication);
  userService = inject(UserService);

  // visual height per hour
  hourHeight = 80;

  // 24 hour labels
  hours = Array.from({ length: 24 }, (_, i) => i);


  // pixels per minute based on hourHeight
  pixelsPerMinute = this.hourHeight / 60;

  // total height of timeline for 24 hours
  timelineHeight = this.hourHeight * 24;

 

  // compute medications for the day based on current user, date, and after start date
  medications = computed(() => {
    const userId = this.userService.getCurrentUser()?.id;
    const selectedDay = this.getDayName();

    return this.medicationService.medications().filter(m =>
      m.user_id === userId &&
      m.days_to_take.includes(selectedDay) 
    );
  });

  // calculate top position and height for each medication based on hour and duration
  positionedMeds() {
    return this.medications().map(med => {
      const totalMinutes = med.hour * 60;

      return {
        ...med,
        top: totalMinutes * this.pixelsPerMinute,
        height: 60 * this.pixelsPerMinute
      };
    });
  }

  // group medications by hour for display in timeline
  groupedMeds = () => {

    const groups: Record<string, any[]> = {};

    // loop through medications and group them by hour
    for (const med of this.medications()) {

      const key = `${med.hour}:`;

      if (!groups[key]) groups[key] = [];

      groups[key].push(med);
    }

    return groups;
  };

  

  // helper function to get day name from date string
  // it parses the date input, creates a Date object, and returns the weekday name in English
  // this is used because of how times are converted
  getDayName(): string {
    const [year, month, day] = this.date().split('-').map(Number);

    const localDate = new Date(year, month - 1, day);

    return localDate.toLocaleDateString('en-US', {
      weekday: 'long'
    });
  }

}
