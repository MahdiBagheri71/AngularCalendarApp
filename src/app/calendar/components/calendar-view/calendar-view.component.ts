import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentFormComponent } from './../appointment-form/appointment-form.component';
import {
  Appointment,
  AppointmentDialogData,
} from '../../../models/appointment.interface';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  standalone: true,
  imports: [CommonModule, DragDropModule, MatMenuModule, MatIconModule],
})
export class CalendarViewComponent implements OnInit {
  currentDate: Date = new Date();

  hours = [
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

  appointments: Appointment[] = [];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(map((params) => new Date(params['date'])))
      .subscribe((date) => {
        this.currentDate = date;
        this.loadAppointments();
      });
  }

  saveAppointments() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const dateKey = this.formatDate(this.currentDate);
      localStorage.setItem(
        `appointments_${dateKey}`,
        JSON.stringify(this.appointments),
      );
    }
  }

  loadAppointments() {
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
    } else {
      this.appointments = this.generateSampleAppointments();
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

    dialogRef.afterClosed().subscribe((result: Appointment | undefined) => {
      if (result) {
        const newAppointment: Appointment = {
          ...result,
          hour: result.time,
        };
        this.appointments.push(newAppointment);
        this.saveAppointments();
      }
    });
  }

  generateSampleAppointments(): Appointment[] {
    const sampleTasks = [
      { title: 'Team Meeting', time: '08:30 AM', hour: '08:00 AM' },
      { title: 'Dentist Appointment', time: '10:00 AM', hour: '10:00 AM' },
      { title: 'Gym', time: '05:00 PM', hour: '05:00 PM' },
      { title: 'Project Discussion', time: '09:00 AM', hour: '09:00 AM' },
      { title: 'Lunch with Sarah', time: '12:30 PM', hour: '12:00 PM' },
      { title: 'Code Review', time: '03:00 PM', hour: '03:00 PM' },
      { title: 'Doctor Visit', time: '01:30 PM', hour: '01:00 PM' },
      { title: 'Workout', time: '07:00 PM', hour: '07:00 PM' },
      { title: 'Client Meeting', time: '04:00 PM', hour: '04:00 PM' },
      { title: 'Reading', time: '06:00 PM', hour: '06:00 PM' },
    ];

    return sampleTasks.map((task) => ({
      ...task,
      color: this.getRandomColor(),
    }));
  }

  getRandomColor() {
    const colors = [
      '#D32F2F',
      '#C2185B',
      '#7B1FA2',
      '#512DA8',
      '#303F9F',
      '#1976D2',
      '#0288D1',
      '#0097A7',
      '#00796B',
      '#388E3C',
      '#689F38',
      '#AFB42B',
      '#B71C1C',
      '#880E4F',
      '#4A148C',
      '#311B92',
      '#1A237E',
      '#0D47A1',
      '#01579B',
      '#006064',
      '#004D40',
      '#1B5E20',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getAppointmentsForHour(hour: string): Appointment[] {
    return this.appointments.filter((app) => app.hour === hour);
  }

  drop(event: CdkDragDrop<Appointment[]>, targetHour: string) {
    const appointment = event.item.data as Appointment;

    if (appointment) {
      appointment.hour = targetHour;
      this.updateAppointmentTime(appointment, targetHour);

      this.appointments = [...this.appointments];
      this.saveAppointments();
    }
  }

  private updateAppointmentTime(appointment: Appointment, hour: string) {
    appointment.time = hour;
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

  deleteAppointment(appointment: Appointment) {
    const index = this.appointments.findIndex(
      (app) => app.title === appointment.title && app.hour === appointment.hour,
    );

    if (index !== -1) {
      this.appointments.splice(index, 1);
      this.saveAppointments();
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
