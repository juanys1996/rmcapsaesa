import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRelatorComponent } from './table-relator.component';

describe('TableRelatorComponent', () => {
  let component: TableRelatorComponent;
  let fixture: ComponentFixture<TableRelatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableRelatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRelatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
