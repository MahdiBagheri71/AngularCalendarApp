import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import {
  Appointment,
  AppointmentDialogData,
} from '../../../models/appointment.interface';
import {
  AVAILABLE_HOURS,
  APPOINTMENT_COLORS,
  SAMPLE_APPOINTMENT_TITLES,
} from '../../../constants/calendar.constants';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatMenuModule,
    MatIconModule,
    MatIconButton,
  ],
})
export class CalendarViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentDate: Date = new Date();
  appointments: Appointment[] = [];
  loading = false;
  error: string | null = null;

  hours = AVAILABLE_HOURS;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {}

  private isValidDateFormat(dateString: string): boolean {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return dateString === `${year}-${month}-${day}`;
  }

  ngOnInit() {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        map((params) => {
          if (!this.isValidDateFormat(params['date'])) {
            throw new Error('INVALID_DATE_FORMAT');
          }
          return new Date(params['date']);
        }),
        catchError((error) => {
          this.error =
            error.message === 'INVALID_DATE_FORMAT'
              ? 'Date must be in YYYY-MM-DD format'
              : 'Invalid date provided';
          return [];
        }),
      )
      .subscribe((date) => {
        if (date) {
          this.currentDate = date;
          this.loadAppointments();
        }
      });
  }

  getAppointmentsForHour(hour: string): Appointment[] {
    return this.appointments.filter((app) => app.hour === hour);
  }

  private loadAppointments() {
    this.loading = true;
    this.error = null;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const dateKey = this.formatDate(this.currentDate);
        const storedAppointments = localStorage.getItem(
          `appointments_${dateKey}`,
        );

        if (storedAppointments) {
          this.appointments = JSON.parse(storedAppointments);
        } else {
          this.appointments = this.generateSampleAppointments();
          this.saveAppointments();
        }
      }
    } catch (error) {
      this.error = 'Error loading the appointments.';
      console.error('Error loading appointments:', error);
    } finally {
      this.loading = false;
    }
  }

  saveAppointments(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const dateKey = this.formatDate(this.currentDate);
        localStorage.setItem(
          `appointments_${dateKey}`,
          JSON.stringify(this.appointments),
        );
      }
    } catch (error) {
      this.error = 'Error saving the appointments.';
      console.error('Error saving appointments:', error);
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  openAppointmentForm(hour: string) {
    const dialogData: AppointmentDialogData = {
      hour,
      isEdit: false,
    };

    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '550px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: Appointment | undefined) => {
        if (result) {
          const newAppointment: Appointment = {
            ...result,
            hour: result.time,
          };
          this.appointments = [...this.appointments, newAppointment];
          this.saveAppointments();
        }
      });
  }

  drop(event: CdkDragDrop<Appointment[]>, targetHour: string) {
    const appointment = event.item.data as Appointment;

    if (appointment) {
      // Check if the target hour already has maximum appointments
      const appointmentsInHour = this.getAppointmentsForHour(targetHour);
      if (appointmentsInHour.length >= 3) {
        this.error = 'A maximum of 3 appointments per hour is allowed.';
        return;
      }

      appointment.hour = targetHour;
      this.updateAppointmentTime(appointment, targetHour);

      this.appointments = [...this.appointments];
      this.saveAppointments();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editAppointment(appointment: Appointment) {
    const dialogData: AppointmentDialogData = {
      hour: appointment.hour,
      isEdit: true,
      appointment: appointment,
    };

    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '550px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result: Appointment | undefined) => {
      if (result) {
        const index = this.appointments.findIndex(
          (app) =>
            app.title === appointment.title && app.hour === appointment.hour,
        );

        if (index !== -1) {
          this.appointments[index] = {
            ...result,
            hour: result.time,
          };
          this.saveAppointments();
        }
      }
    });
  }

  private updateAppointmentTime(appointment: Appointment, hour: string) {
    appointment.time = hour;
  }

  deleteAppointment(appointment: Appointment) {
    const index = this.appointments.findIndex(
      (app) => app.title === appointment.title && app.hour === appointment.hour,
    );

    if (index !== -1) {
      this.appointments.splice(index, 1);
      this.saveAppointments();
    }
  }

  generateSampleAppointments(): Appointment[] {
    const numberOfAppointments = Math.floor(Math.random() * 8) + 3; // Random number between 3 and 10
    const appointments: Appointment[] = [];
    const usedHours = new Set<string>();

    for (let i = 0; i < numberOfAppointments; i++) {
      let randomHour: string;
      do {
        const randomIndex = Math.floor(Math.random() * AVAILABLE_HOURS.length);
        randomHour = AVAILABLE_HOURS[randomIndex];
      } while (usedHours.has(randomHour));

      usedHours.add(randomHour);

      const randomTitle =
        SAMPLE_APPOINTMENT_TITLES[
          Math.floor(Math.random() * SAMPLE_APPOINTMENT_TITLES.length)
        ];

      appointments.push({
        title: randomTitle,
        time: randomHour,
        hour: randomHour,
        color:
          APPOINTMENT_COLORS[
            Math.floor(Math.random() * APPOINTMENT_COLORS.length)
          ],
      });
    }

    return appointments;
  }

  getRandomColor() {
    return APPOINTMENT_COLORS[
      Math.floor(Math.random() * APPOINTMENT_COLORS.length)
    ];
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
