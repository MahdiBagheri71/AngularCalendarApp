import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from './../appointment-form/appointment-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
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

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.loadAppointments();
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

  loadAppointments() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedAppointments = localStorage.getItem('appointments');
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

  saveAppointments() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('appointments', JSON.stringify(this.appointments));
    }
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
