import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutemapComponent } from './routemap.component';

describe('RoutemapComponent', () => {
  let component: RoutemapComponent;
  let fixture: ComponentFixture<RoutemapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoutemapComponent]
    });
    fixture = TestBed.createComponent(RoutemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
