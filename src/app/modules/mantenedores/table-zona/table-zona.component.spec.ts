import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableZonaComponent } from './table-zona.component';

describe('TableZonaComponent', () => {
  let component: TableZonaComponent;
  let fixture: ComponentFixture<TableZonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableZonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableZonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
