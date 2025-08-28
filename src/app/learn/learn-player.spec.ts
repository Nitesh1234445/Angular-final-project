import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnPlayer } from './learn-player';

describe('LearnPlayer', () => {
  let component: LearnPlayer;
  let fixture: ComponentFixture<LearnPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
