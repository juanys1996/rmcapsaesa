import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFocoComponent } from './table-foco.component';

describe('TableFocoComponent', () => {
  let component: TableFocoComponent;
  let fixture: ComponentFixture<TableFocoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFocoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFocoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
