import { Routes } from '@angular/router';
import { Calendar } from './calendar/calendar';

export const routes: Routes = [ 
    {
        path: '',
        component: Calendar,
        title: 'Calendar'
    }
];
