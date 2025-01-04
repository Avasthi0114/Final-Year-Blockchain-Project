import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceViewprofileComponent } from './police-viewprofile.component';

describe('PoliceViewprofileComponent', () => {
  let component: PoliceViewprofileComponent;
  let fixture: ComponentFixture<PoliceViewprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliceViewprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceViewprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
