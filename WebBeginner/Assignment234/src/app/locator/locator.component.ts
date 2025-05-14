import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomPoint } from '../custom-point/custom-poin.module';

@Component({
  selector: 'app-locator',
  templateUrl: './locator.component.html',
  styleUrls: ['./locator.component.css'],
})
export class LocatorComponent {
  @Input() formTitle: string = 'Locator';  // ค่าเริ่มต้นเป็น 'Locator'
  @Output() locate = new EventEmitter<CustomPoint>();

  latitude: number | null = null;
  longitude: number | null = null;

  // เมื่อต้องการป้อนค่าพิกัดและ emit ค่า
  onLocate() {
    if (this.latitude != null && this.longitude != null) {
      const customPoint = new CustomPoint(this.latitude, this.longitude);
      this.locate.emit(customPoint); // ส่งค่าออกไป
      console.log(customPoint)
    }
  }
    
    // emitLocation() {
    //   console.log('Location Emitted:', { latitude: this.latitude, longitude: this.longitude });
    // }
  }
