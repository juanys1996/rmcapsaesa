import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoPlanificacionComponent } from './periodo-planificacion.component';

describe('PeriodoPlanificacionComponent', () => {
  let component: PeriodoPlanificacionComponent;
  let fixture: ComponentFixture<PeriodoPlanificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodoPlanificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodoPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
