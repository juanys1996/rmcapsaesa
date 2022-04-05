import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaModalComponent } from './zona-modal.component';

describe('ZonaModalComponent', () => {
  let component: ZonaModalComponent;
  let fixture: ComponentFixture<ZonaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZonaModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
