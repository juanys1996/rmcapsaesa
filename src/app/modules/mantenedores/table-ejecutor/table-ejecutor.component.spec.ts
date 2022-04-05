import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEjecutorComponent } from './table-ejecutor.component';

describe('TableEjecutorComponent', () => {
  let component: TableEjecutorComponent;
  let fixture: ComponentFixture<TableEjecutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableEjecutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableEjecutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
