import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
