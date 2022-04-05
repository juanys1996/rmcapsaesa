import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthCardComponent } from './month-card.component';

describe('MonthCardComponent', () => {
  let component: MonthCardComponent;
  let fixture: ComponentFixture<MonthCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
