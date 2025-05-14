import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuffermapComponent } from './buffermap.component';

describe('BuffermapComponent', () => {
  let component: BuffermapComponent;
  let fixture: ComponentFixture<BuffermapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuffermapComponent]
    });
    fixture = TestBed.createComponent(BuffermapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
