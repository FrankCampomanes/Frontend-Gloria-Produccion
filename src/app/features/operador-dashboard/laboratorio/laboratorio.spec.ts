import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Laboratorio } from './laboratorio';

describe('Laboratorio', () => {
  let component: Laboratorio;
  let fixture: ComponentFixture<Laboratorio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Laboratorio],
    }).compileComponents();

    fixture = TestBed.createComponent(Laboratorio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
