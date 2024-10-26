import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    MatSelectModule
  ]
})
export class AppointmentFormComponent implements OnInit {
  form: FormGroup;
  availableHours: string[] = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
  ];
  defaultColors: string[] = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
    '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
    '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hour: string }
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      time: ['', Validators.required],
      color: ['#448AFF', Validators.required]
    });
  }

  ngOnInit() {
    const formattedHour = this.data.hour.padStart(2, '0') + ':00';
    this.form.patchValue({
      time: formattedHour
    });
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
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
