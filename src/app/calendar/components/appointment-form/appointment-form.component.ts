import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import {
  Appointment,
  AppointmentDialogData,
  ValidationMessages,
} from '../../../models/appointment.interface';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  AVAILABLE_HOURS,
  APPOINTMENT_COLORS,
} from '../../../constants/calendar.constants';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
  ],
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  private destroy$ = new Subject<void>();
  formErrors: { [key: string]: string } = {};

  availableHours = AVAILABLE_HOURS;
  defaultColors = APPOINTMENT_COLORS;

  validationMessages: ValidationMessages = {
    title: {
      required: 'Title is required',
      minlength: 'Title must be at least 3 characters long',
      maxlength: 'Title cannot be more than 50 characters long',
    },
    time: {
      required: 'Time is required',
    },
    color: {
      required: 'Color is required',
    },
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentDialogData,
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      time: ['', Validators.required],
      color: ['#1B5E20', Validators.required],
    });
  }

  ngOnInit() {
    this.setupFormValueChanges();
    this.loadInitialData();
  }

  private setupFormValueChanges(): void {
    // Monitor title changes with debounce
    this.form
      .get('title')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.validateField('title');
      });

    // Monitor time changes
    this.form
      .get('time')
      ?.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => {
        this.validateField('time');
      });

    // Monitor color changes
    this.form
      .get('color')
      ?.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => {
        this.validateField('color');
      });
  }

  private loadInitialData(): void {
    if (this.data.isEdit && this.data.appointment) {
      this.form.patchValue({
        title: this.data.appointment.title,
        time: this.data.appointment.hour,
        color: this.data.appointment.color,
      });
    } else if (this.data.hour) {
      this.form.patchValue({
        time: this.data.hour,
      });
    }
  }

  validateField(fieldName: 'title' | 'time' | 'color'): void {
    const control = this.form.get(fieldName);
    const messages = this.validationMessages[fieldName];

    this.formErrors[fieldName] = '';

    if (control && !control.valid && (control.dirty || control.touched)) {
      Object.keys(control.errors || {}).some((errorKey) => {
        if (messages[errorKey]) {
          this.formErrors[fieldName] = messages[errorKey];
          return true;
        }
        return false;
      });
    }
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const appointment: Appointment = {
        title: formValue.title.trim(),
        time: formValue.time,
        hour: formValue.time,
        color: formValue.color,
      };
      this.dialogRef.close(appointment);
    } else {
      this.validateAllFormFields();
    }
  }

  private validateAllFormFields() {
    const fields: Array<'title' | 'time' | 'color'> = [
      'title',
      'time',
      'color',
    ];
    fields.forEach((field) => {
      const control = this.form.get(field);
      control?.markAsTouched();
      this.validateField(field);
    });
  }

  getErrorMessage(controlName: string): string {
    return this.formErrors[controlName] || '';
  }

  cancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
