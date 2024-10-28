import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CalendarViewComponent } from './calendar-view.component';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { Appointment } from '../../../models/appointment.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('CalendarViewComponent', () => {
  let component: CalendarViewComponent;
  let fixture: ComponentFixture<CalendarViewComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  const dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of({}),
    close: null,
  });

  const mockAppointment: Appointment = {
    title: 'Test Appointment',
    time: '09:00 AM',
    hour: '09:00 AM',
    color: '#D32F2F',
  };

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    await TestBed.configureTestingModule({
      imports: [
        CalendarViewComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize hours array correctly', () => {
    expect(component.hours.length).toBe(12);
    expect(component.hours[0]).toBe('08:00 AM');
    expect(component.hours[component.hours.length - 1]).toBe('07:00 PM');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize hours array correctly', () => {
    expect(component.hours.length).toBe(12);
    expect(component.hours[0]).toBe('08:00 AM');
    expect(component.hours[component.hours.length - 1]).toBe('07:00 PM');
  });


  describe('getAppointmentsForHour', () => {
    beforeEach(() => {
      component.appointments = [
        { ...mockAppointment },
        { ...mockAppointment, hour: '10:00 AM' },
      ];
    });

    it('should return empty array for hour with no appointments', () => {
      const result = component.getAppointmentsForHour('11:00 AM');

      expect(result.length).toBe(0);
    });
  });

  describe('deleteAppointment', () => {
    beforeEach(() => {
      component.appointments = [mockAppointment];
    });


    it('should save appointments after deletion', () => {
      spyOn(component, 'saveAppointments');

      component.deleteAppointment(mockAppointment);

      expect(component.saveAppointments).toHaveBeenCalled();
    });
  });

  describe('getRandomColor', () => {
    it('should return a valid color string', () => {
      const color = component.getRandomColor();

      expect(color).toMatch(/#[0-9A-F]{6}/i);
    });
  });

  describe('stopPropagation', () => {
    it('should stop event propagation', () => {
      const mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);

      component.stopPropagation(mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });
});
