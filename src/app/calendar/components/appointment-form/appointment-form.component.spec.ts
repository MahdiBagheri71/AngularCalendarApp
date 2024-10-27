import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentFormComponent } from './appointment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

describe('AppointmentFormComponent', () => {
  let component: AppointmentFormComponent;
  let fixture: ComponentFixture<AppointmentFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AppointmentFormComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        AppointmentFormComponent, // اضافه کردن کامپوننت در imports
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { hour: '08' }, // مقدار پیش‌فرض hour برای جلوگیری از خطای padStart
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form.value).toEqual({
      title: '',
      time: '08:00', // مقدار پیش‌فرض از hour
      color: '#448AFF',
    });
  });

  it('should validate title input as required', () => {
    const titleControl = component.form.get('title');
    titleControl?.setValue('');
    expect(titleControl?.valid).toBeFalse();
    titleControl?.setValue('Meeting');
    expect(titleControl?.valid).toBeTrue();
  });

  it('should validate time selection as required', () => {
    const timeControl = component.form.get('time');
    timeControl?.setValue('');
    expect(timeControl?.valid).toBeFalse();
    timeControl?.setValue('10:00');
    expect(timeControl?.valid).toBeTrue();
  });

  it('should call submit method and close dialog with form data when form is valid', () => {
    spyOn(component, 'submit').and.callThrough();

    component.form.setValue({
      title: 'New Meeting',
      time: '09:00',
      color: '#FF4081',
    });

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(component.submit).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.form.value);
  });

  it('should not close the dialog if form is invalid on submit', () => {
    component.form.setValue({
      title: '',
      time: '',
      color: '',
    });

    component.submit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close the dialog when cancel button is clicked', () => {
    const cancelButton = fixture.debugElement.query(
      By.css('.dialog-actions button[type="button"]'),
    );
    cancelButton.nativeElement.click();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should select a color on color circle click', () => {
    const color = component.defaultColors[0];
    const colorCircle = fixture.debugElement.queryAll(
      By.css('.color-circle'),
    )[0];
    colorCircle.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.form.get('color')?.value).toBe(color);
    expect(colorCircle.nativeElement.classList).toContain('selected');
  });

  it('should enable submit button if form is valid', () => {
    component.form.get('title')?.setValue('Meeting');
    component.form.get('time')?.setValue('10:00');
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    );
    expect(submitButton.nativeElement.disabled).toBeFalse();
  });
});
