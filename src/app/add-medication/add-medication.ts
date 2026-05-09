import { Component, signal, inject } from '@angular/core';
import { Medication } from '../medication';
import { MedicationModel } from '../models/medication-model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-medication',
  imports: [FormsModule],
  templateUrl: './add-medication.html',
  styleUrl: './add-medication.css',
})
export class AddMedication {
  userService = inject(UserService);
  medicationService = inject(Medication);

  message = signal<string>('');

  // medication form signals
  name = signal('');
  description = signal('');
  hour = signal(0);

  // stores selected weekdays
  days_to_take = signal<string[]>([]);

  // weekday options for checkboxes
  weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // toggles weekdays in array
  toggleDay(day: string) {
    // if day already exists remove it
    if (this.days_to_take().includes(day)) {
      this.days_to_take.update((days) => days.filter((d) => d !== day));
    }

    // otherwise add it
    else {
      this.days_to_take.update((days) => [...days, day]);
    }
  }

  // creates medication object and sends to firestore
  async addMedication() {

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const medication: MedicationModel = {
      med_id: Date.now(),

      user_id: this.userService.getCurrentUser()?.id || 'unknown',

      name: this.name(),

      description: this.description(),

      hour: this.hour(),

      days_to_take: this.days_to_take(),

      // stores todays date
      date_added: now.toISOString().split('T')[0],

      // starts empty until medication taken
      dates_taken: [],
    };

    await this.medicationService.addMedication(medication);

    this.resetForm();

    // show success message
    this.message.set('Medication added');

    // clear after short delay
    setTimeout(() => {
      this.message.set('');
    }, 2000);
  }

  // resets form after medication added
  resetForm() {
    this.name.set('');
    this.description.set('');
    this.hour.set(0);
    this.days_to_take.set([]);
  }
}
