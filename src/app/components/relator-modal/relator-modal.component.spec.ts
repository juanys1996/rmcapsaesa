import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorModalComponent } from './relator-modal.component';

describe('RelatorModalComponent', () => {
  let component: RelatorModalComponent;
  let fixture: ComponentFixture<RelatorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
