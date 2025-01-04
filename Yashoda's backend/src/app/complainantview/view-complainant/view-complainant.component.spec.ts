import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComplainantComponent } from './view-complainant.component';

describe('ViewComplainantComponent', () => {
  let component: ViewComplainantComponent;
  let fixture: ComponentFixture<ViewComplainantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewComplainantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewComplainantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
