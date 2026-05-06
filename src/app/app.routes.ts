import { Routes } from '@angular/router';
import { Calendar } from './calendar/calendar';
import { UserAuth } from './auth/auth';

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
];
