import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionModalComponent } from './capacitacion-modal.component';

describe('CapacitacionModalComponent', () => {
  let component: CapacitacionModalComponent;
  let fixture: ComponentFixture<CapacitacionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacitacionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacitacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
