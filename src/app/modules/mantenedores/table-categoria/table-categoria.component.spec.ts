import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCategoriaComponent } from './table-categoria.component';

describe('TableCategoriaComponent', () => {
  let component: TableCategoriaComponent;
  let fixture: ComponentFixture<TableCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
