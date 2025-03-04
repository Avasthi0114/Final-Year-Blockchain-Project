import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIviewOfficerComponent } from './piview-officer.component';

describe('PIviewOfficerComponent', () => {
  let component: PIviewOfficerComponent;
  let fixture: ComponentFixture<PIviewOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PIviewOfficerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PIviewOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
