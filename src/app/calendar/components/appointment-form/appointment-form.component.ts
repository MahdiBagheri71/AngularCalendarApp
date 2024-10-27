import { Component, Inject, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';

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
export class AppointmentFormComponent implements OnInit {
  form: FormGroup;
  availableHours: string[] = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];
  defaultColors: string[] = [
    '#D32F2F', // Dark Red
    '#C2185B', // Dark Pink
    '#7B1FA2', // Dark Purple
    '#512DA8', // Deep Purple
    '#303F9F', // Dark Indigo
    '#1976D2', // Dark Blue
    '#0288D1', // Dark Light Blue
    '#0097A7', // Dark Cyan
    '#00796B', // Dark Teal
    '#388E3C', // Dark Green
    '#689F38', // Dark Light Green
    '#AFB42B', // Dark Lime
    '#B71C1C', // Deeper Red
    '#880E4F', // Deeper Pink
    '#4A148C', // Deeper Purple
    '#311B92', // Deeper Purple
    '#1A237E', // Deeper Indigo
    '#0D47A1', // Deeper Blue
    '#01579B', // Deeper Light Blue
    '#006064', // Deeper Cyan
    '#004D40', // Deeper Teal
    '#1B5E20', // Deeper Green
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      hour: string;
      isEdit?: boolean;
      appointment?: any;
    },
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      time: ['', Validators.required],
      color: ['#448AFF', Validators.required],
    });
  }

  ngOnInit() {
    if (this.data.isEdit && this.data.appointment) {
      this.form.patchValue({
        title: this.data.appointment.title,
        time: this.data.appointment.hour,
        color: this.data.appointment.color,
      });
    } else {
      const formattedHour = this.data.hour;
      if (formattedHour) {
        this.form.patchValue({
          time: formattedHour,
        });
      }
    }
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return 'Minimum 3 characters required';
    }
    return '';
  }
}
