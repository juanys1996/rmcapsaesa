import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificacionModalComponent } from './planificacion-modal.component';

describe('CategoriaModalComponent', () => {
  let component: PlanificacionModalComponent;
  let fixture: ComponentFixture<PlanificacionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanificacionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanificacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
