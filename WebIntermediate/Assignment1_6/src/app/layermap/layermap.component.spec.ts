import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayermapComponent } from './layermap.component';

describe('LayermapComponent', () => {
  let component: LayermapComponent;
  let fixture: ComponentFixture<LayermapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayermapComponent]
    });
    fixture = TestBed.createComponent(LayermapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
