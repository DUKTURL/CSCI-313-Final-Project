import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTimer } from './day-timer';

describe('DayTimer', () => {
  let component: DayTimer;
  let fixture: ComponentFixture<DayTimer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayTimer],
    }).compileComponents();

    fixture = TestBed.createComponent(DayTimer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
