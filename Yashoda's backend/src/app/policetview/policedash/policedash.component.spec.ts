import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicedashComponent } from './policedash.component';

describe('PolicedashComponent', () => {
  let component: PolicedashComponent;
  let fixture: ComponentFixture<PolicedashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicedashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolicedashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
