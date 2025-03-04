import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiviewcomplaintComponent } from './piviewcomplaint.component';

describe('PiviewcomplaintComponent', () => {
  let component: PiviewcomplaintComponent;
  let fixture: ComponentFixture<PiviewcomplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiviewcomplaintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PiviewcomplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
