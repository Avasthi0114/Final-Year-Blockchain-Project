import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIviewprofileComponent } from './piviewprofile.component';

describe('PIviewprofileComponent', () => {
  let component: PIviewprofileComponent;
  let fixture: ComponentFixture<PIviewprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PIviewprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PIviewprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
