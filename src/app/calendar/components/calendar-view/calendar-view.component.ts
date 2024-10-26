import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent implements OnInit {
  appointments = [
    { title: 'Meeting', date: new Date(), time: '10:00' },
    { title: 'Dentist', date: new Date(), time: '14:00' }
  ];

  ngOnInit(): void {}

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.appointments, event.previousIndex, event.currentIndex);
  }
}
