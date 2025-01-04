import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceFIRFormComponent } from './police-fir-form.component';

describe('PoliceFIRFormComponent', () => {
  let component: PoliceFIRFormComponent;
  let fixture: ComponentFixture<PoliceFIRFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliceFIRFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceFIRFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
