import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignpoliceComponent } from './assignpolice.component';

describe('AssignpoliceComponent', () => {
  let component: AssignpoliceComponent;
  let fixture: ComponentFixture<AssignpoliceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignpoliceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignpoliceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
