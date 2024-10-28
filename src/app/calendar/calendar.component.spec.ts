import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDatepickerModule,
        MatCardModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        RouterTestingModule,
        CalendarComponent // اضافه کردن کامپوننت به imports
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date correctly', () => {
    const date = new Date(2023, 9, 28); // 28 October 2023
    const formattedDate = component['formatDate'](date);
    expect(formattedDate).toBe('2023-10-28');
  });

  it('should navigate to the correct route on date selection', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const date = new Date(2023, 9, 28); // 28 October 2023

    component.dateSelected(date);

    expect(navigateSpy).toHaveBeenCalledWith(['/calendars', '2023-10-28']);
  });
});
