import { Routes } from '@angular/router';
import { Calendar } from './calendar/calendar';
import { UserAuth } from './auth/auth';
import { DayView } from './day-view/day-view';

export const routes: Routes = [
  {
    path: '',
    component: Calendar,
    title: 'Calendar',
  },
  {
    path: 'auth',
    component: UserAuth,
    title: 'Authentication',
  },
  {
    path: 'day/:date',
    component: DayView,
    title: 'Day View',
  }
];
