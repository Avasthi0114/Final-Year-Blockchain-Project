import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIdashboardComponent } from './pidashboard.component';

describe('PIdashboardComponent', () => {
  let component: PIdashboardComponent;
  let fixture: ComponentFixture<PIdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PIdashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PIdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
