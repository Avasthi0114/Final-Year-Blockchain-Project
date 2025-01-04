import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainantdashboardComponent } from './complainantdashboard.component';

describe('ComplainantdashboardComponent', () => {
  let component: ComplainantdashboardComponent;
  let fixture: ComponentFixture<ComplainantdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplainantdashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplainantdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
