import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfoqueModalComponent } from './enfoque-modal.component';

describe('EnfoqueModalComponent', () => {
  let component: EnfoqueModalComponent;
  let fixture: ComponentFixture<EnfoqueModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnfoqueModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnfoqueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
