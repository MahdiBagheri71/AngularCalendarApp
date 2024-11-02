import { Component } from '@angular/core';
import {
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  dateControl = new FormControl<Date | null>(null, {
    validators: [
      Validators.required,
      (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
          return { required: true };
        }

        const selectedDate = new Date(control.value);
        const currentDate = new Date();
        const oneYearAgo = new Date(currentDate);
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

        const twoYearsAhead = new Date(currentDate);
        twoYearsAhead.setFullYear(currentDate.getFullYear() + 2);

        if (selectedDate < oneYearAgo || selectedDate > twoYearsAhead) {
          return { dateOutOfRange: true };
        }

        return null;
      },
    ],
  });

  constructor(private router: Router) {}

  dateSelected(date: Date) {
    if (this.dateControl.invalid) {
      alert(
        'Selected date is out of the allowed range (one year ago to two years ahead).',
      );
      return;
    }
    // Format the date to 'YYYY-MM-DD'
    const formattedDate = this.formatDate(date);
    this.router.navigate(['/calendars', formattedDate]);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
