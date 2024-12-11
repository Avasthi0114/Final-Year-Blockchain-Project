import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceSignUpPageComponent } from './police-sign-up-page.component';

describe('PoliceSignUpPageComponent', () => {
  let component: PoliceSignUpPageComponent;
  let fixture: ComponentFixture<PoliceSignUpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliceSignUpPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceSignUpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
