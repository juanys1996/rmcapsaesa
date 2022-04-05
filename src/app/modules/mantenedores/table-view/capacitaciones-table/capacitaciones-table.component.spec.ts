import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionesTableComponent } from './capacitaciones-table.component';

describe('CapacitacionesTableComponent', () => {
  let component: CapacitacionesTableComponent;
  let fixture: ComponentFixture<CapacitacionesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacitacionesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacitacionesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
