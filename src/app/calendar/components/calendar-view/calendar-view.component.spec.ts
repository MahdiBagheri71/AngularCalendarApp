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
      imports: [CalendarViewComponent, BrowserAnimationsModule],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
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

  describe('loadAppointments', () => {
    it('should load appointments from localStorage if available', () => {
      const mockStoredAppointments = [mockAppointment];
      spyOn(localStorage, 'getItem').and.returnValue(
        JSON.stringify(mockStoredAppointments),
      );

      component.loadAppointments();

      expect(component.appointments).toEqual(mockStoredAppointments);
    });

    it('should generate sample appointments if localStorage is empty', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(component, 'generateSampleAppointments').and.callThrough();

      component.loadAppointments();

      expect(component.generateSampleAppointments).toHaveBeenCalled();
      expect(component.appointments.length).toBeGreaterThan(0);
    });
  });

  describe('saveAppointments', () => {
    it('should save appointments to localStorage', () => {
      const setItemSpy = spyOn(localStorage, 'setItem');
      component.appointments = [mockAppointment];

      component.saveAppointments();

      expect(setItemSpy).toHaveBeenCalledWith(
        'appointments',
        JSON.stringify([mockAppointment]),
      );
    });
  });

  describe('openAppointmentForm', () => {
    const mockDialogData = {
      hour: '09:00 AM',
      isEdit: false,
    };

    it('should open dialog with correct data', () => {
      component.openAppointmentForm('09:00 AM');

      expect(dialogSpy.open).toHaveBeenCalledWith(AppointmentFormComponent, {
        width: '550px',
        data: mockDialogData,
      });
    });

    it('should add new appointment when dialog returns data', fakeAsync(() => {
      dialogRefSpyObj.afterClosed.and.returnValue(of(mockAppointment));

      component.openAppointmentForm('09:00 AM');
      tick();

      expect(component.appointments).toContain(
        jasmine.objectContaining({
          title: mockAppointment.title,
          hour: mockAppointment.time,
        }),
      );
    }));
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

  describe('drop', () => {
    it('should update appointment hour and time when dropped', () => {
      const dropEvent = {
        item: { data: mockAppointment },
      } as CdkDragDrop<Appointment[]>;
      const targetHour = '10:00 AM';

      component.appointments = [mockAppointment];
      component.drop(dropEvent, targetHour);

      expect(component.appointments[0].hour).toBe(targetHour);
      expect(component.appointments[0].time).toBe(targetHour);
    });
  });

  describe('editAppointment', () => {
    const updatedAppointment = { ...mockAppointment, title: 'Updated Title' };

    beforeEach(() => {
      component.appointments = [mockAppointment];
    });

    it('should open dialog with correct edit data', () => {
      component.editAppointment(mockAppointment);

      expect(dialogSpy.open).toHaveBeenCalledWith(AppointmentFormComponent, {
        width: '550px',
        data: {
          hour: mockAppointment.hour,
          isEdit: true,
          appointment: mockAppointment,
        },
      });
    });

    it('should update appointment when dialog returns data', fakeAsync(() => {
      dialogRefSpyObj.afterClosed.and.returnValue(of(updatedAppointment));

      component.editAppointment(mockAppointment);
      tick();

      expect(component.appointments[0].title).toBe('Updated Title');
    }));
  });

  describe('deleteAppointment', () => {
    beforeEach(() => {
      component.appointments = [mockAppointment];
    });

    it('should remove appointment from array', () => {
      component.deleteAppointment(mockAppointment);

      expect(component.appointments.length).toBe(0);
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
