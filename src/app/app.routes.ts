import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'calendars',
    loadComponent: () => import('./calendar/components/calendar-view/calendar-view.component').then(m => m.CalendarViewComponent)
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

