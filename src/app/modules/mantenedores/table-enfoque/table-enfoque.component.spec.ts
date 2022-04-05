import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEnfoqueComponent } from './table-enfoque.component';

describe('TableEnfoqueComponent', () => {
  let component: TableEnfoqueComponent;
  let fixture: ComponentFixture<TableEnfoqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableEnfoqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableEnfoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
