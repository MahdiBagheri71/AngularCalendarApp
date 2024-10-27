export interface Appointment {
  title: string;
  time: string;
  hour: string;
  color: string;
}

export interface AppointmentDialogData {
  hour: string;
  isEdit?: boolean;
  appointment?: Appointment;
}
