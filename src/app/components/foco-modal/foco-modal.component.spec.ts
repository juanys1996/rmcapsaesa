import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocoModalComponent } from './foco-modal.component';

describe('FocoModalComponent', () => {
  let component: FocoModalComponent;
  let fixture: ComponentFixture<FocoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
