import { Component } from '@angular/core';
import { input } from '@angular/core';
import { DayTimer } from './day-timer/day-timer';
import { Medication } from '../medication';

@Component({
  selector: 'app-day-view',
  imports: [DayTimer],
  templateUrl: './day-view.html',
  styleUrl: './day-view.css',
})
export class DayView {
  // date from route 
  date = input.required<string>();
}
