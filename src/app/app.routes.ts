import { Routes } from '@angular/router';
import {CalendarViewComponent} from './calendar/components/calendar-view/calendar-view.component';


export const routes: Routes = [
  {
    path: 'calendars',
    component: CalendarViewComponent
  },
  {
    path: '',
    redirectTo: '/calendars',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./error/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

