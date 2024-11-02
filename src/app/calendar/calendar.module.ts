import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [{ path: '', component: CalendarComponent }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CalendarComponent,
  ],
})
export class CalendarModule {}
