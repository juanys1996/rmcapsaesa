import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PronexoWorkersModalComponent } from './pronexo-workers-modal.component';

describe('PronexoWorkersModalComponent', () => {
  let component: PronexoWorkersModalComponent;
  let fixture: ComponentFixture<PronexoWorkersModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PronexoWorkersModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PronexoWorkersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
