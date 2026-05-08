import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-day-timer',
  imports: [],
  templateUrl: './day-timer.html',
  styleUrl: './day-timer.css',
})
export class DayTimer {
  date = input.required<string>();

  // visual height per hour
  hourHeight = 80;

  // 24 hour labels
  hours = Array.from({ length: 24 }, (_, i) => i);


  // pixels per minute based on hourHeight
  pixelsPerMinute = this.hourHeight / 60;

  // total height of timeline for 24 hours
  timelineHeight = this.hourHeight * 24;

 

  medications = [
  {
    id: '1',
    name: 'Vitamin D',
    hour: 10,
    minute: 30,
  },
  {
    id: '2',
    name: 'Vitamin C',
    hour: 10,
    minute: 30,
  }
];

// compute top position and height for each medication based on user entered time
positionedMeds() {
  return this.medications.map(med => {
    const totalMinutes = med.hour * 60 + med.minute;

    return {
      ...med,
      top: totalMinutes * this.pixelsPerMinute,
      height: 60 * this.pixelsPerMinute
    };
  });
}

// group medications by time for display in timeline so that they dont stack on top of each other
groupedMeds = () => {

  // key is "hour:minute" and value is array of meds at that time
  const groups: Record<string, any[]> = {};

  // group meds by "hour:minute" key
  for (const med of this.medications) {

    const key = `${med.hour}:${med.minute}`;

    if (!groups[key]) groups[key] = [];

    groups[key].push(med);
  }

  return groups;
};


}
