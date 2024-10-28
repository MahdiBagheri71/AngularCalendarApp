import { Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar/components/calendar-view/calendar-view.component';
import { CalendarComponent } from './calendar/calendar.component';

export const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
  },
  {
    path: 'calendars/:date',
    component: CalendarViewComponent,
  },
  {
    path: '**',
    loadComponent: () =>
      import('./error/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
