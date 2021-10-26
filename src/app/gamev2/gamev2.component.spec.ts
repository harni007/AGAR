import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gamev2Component } from './gamev2.component';

describe('Gamev2Component', () => {
  let component: Gamev2Component;
  let fixture: ComponentFixture<Gamev2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Gamev2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Gamev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
