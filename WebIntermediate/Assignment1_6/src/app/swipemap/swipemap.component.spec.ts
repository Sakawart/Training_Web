import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipemapComponent } from './swipemap.component';

describe('SwipemapComponent', () => {
  let component: SwipemapComponent;
  let fixture: ComponentFixture<SwipemapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwipemapComponent]
    });
    fixture = TestBed.createComponent(SwipemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
