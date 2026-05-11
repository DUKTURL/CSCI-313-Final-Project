import { Component, input, inject, computed} from '@angular/core';
import { DayTimer } from './day-timer/day-timer';
import { Medication } from '../medication';
import { UserService } from '../user.service';
import { MedicationModel } from '../models/medication-model';

@Component({
  selector: 'app-day-view',
  imports: [DayTimer],
  templateUrl: './day-view.html',
  styleUrl: './day-view.css',
})
export class DayView {
  // date from route 
  date = input.required<string>();

  medicationService = inject(Medication);
  userService = inject(UserService);

  // compute medications for the day based on current user, date, and after start date

  medications = computed(() => {

    const userId = this.userService.getCurrentUser()?.id;
    const selectedDay = this.getDayName();

    return this.medicationService.medications().filter(m =>
      m.user_id === userId &&
      m.days_to_take.includes(selectedDay) && 
      m.date_added <= this.date()
    );
  });

  //reused function to get day name from date string
  getDayName(): string {
    const [year, month, day] = this.date().split('-').map(Number);

    const localDate = new Date(year, month - 1, day);

    return localDate.toLocaleDateString('en-US', {
      weekday: 'long'
    });
  }

// toggle medication taken status for the specific day
async toggleTaken(med: MedicationModel, event: Event) {

  if (!med.id) return;

  const checked = (event.target as HTMLInputElement).checked;

  const today = this.date();

  // add a date if checked
  if (checked) {

    if (med.dates_taken.includes(today)) return;

    await this.medicationService.markMedicationTaken(
      med.id!,
      today,
      med.dates_taken
    );

  }

  // remove a date if unchecked
  else {

    const updatedDates = med.dates_taken.filter(d => d !== today);

      await this.medicationService.updateMedicationDates(
        med.id!,
        updatedDates
      );

    }
  }

  // delete a medication from the day view, which calls the medication service to delete it from Firestore
  async deleteMedication(med: MedicationModel) {
    if (!med.id) return;
    await this.medicationService.deleteMedication(med.id);
  }
}
