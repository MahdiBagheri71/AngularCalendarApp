import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatDatepickerModule,
        MatCardModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        CalendarComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a dateControl FormControl', () => {
    expect(component.dateControl).toBeDefined();
  });

  it('should validate dateControl for required field', () => {
    component.dateControl.setValue(null);
    expect(component.dateControl.valid).toBeFalse();
    expect(component.dateControl.errors).toEqual({ required: true });
  });

  it('should validate dateControl for out of range dates', () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const twoYearsAhead = new Date();
    twoYearsAhead.setFullYear(twoYearsAhead.getFullYear() + 2);

    component.dateControl.setValue(oneYearAgo);
    expect(component.dateControl.valid).toBeTrue();

    component.dateControl.setValue(new Date(oneYearAgo.getTime() - 1));
    expect(component.dateControl.valid).toBeFalse();
    expect(component.dateControl.errors).toEqual({ dateOutOfRange: true });

    component.dateControl.setValue(new Date(twoYearsAhead.getTime() + 1));
    expect(component.dateControl.valid).toBeFalse();
    expect(component.dateControl.errors).toEqual({ dateOutOfRange: true });
  });

  it('should navigate to the correct URL when a valid date is selected', () => {
    spyOn(router, 'navigate');
    const validDate = new Date();
    component.dateControl.setValue(validDate);

    component.dateSelected(validDate);
    const formattedDate = component.formatDate(validDate);
    expect(router.navigate).toHaveBeenCalledWith(['/calendars', formattedDate]);
  });

  it('should alert when an invalid date is selected', () => {
    spyOn(window, 'alert');
    const invalidDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 3),
    );
    component.dateControl.setValue(invalidDate);

    component.dateSelected(invalidDate);
    expect(window.alert).toHaveBeenCalledWith(
      'Selected date is out of the allowed range (one year ago to two years ahead).',
    );
  });
});
