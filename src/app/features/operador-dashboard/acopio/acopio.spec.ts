import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Acopio } from './acopio';

describe('Acopio', () => {
  let component: Acopio;
  let fixture: ComponentFixture<Acopio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acopio],
    }).compileComponents();

    fixture = TestBed.createComponent(Acopio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
