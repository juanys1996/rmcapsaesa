import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecutorModalComponent } from './ejecutor-modal.component';

describe('EjecutorModalComponent', () => {
  let component: EjecutorModalComponent;
  let fixture: ComponentFixture<EjecutorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjecutorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EjecutorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
