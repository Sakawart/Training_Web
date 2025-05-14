import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Swipe from '@arcgis/core/widgets/Swipe';

@Component({
  selector: 'app-swipemap',
  templateUrl: './swipemap.component.html',
  styleUrls: ['./swipemap.component.css']
})
export class SwipemapComponent implements OnInit {

  view: MapView | undefined;

  constructor() { }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    // สร้างชั้นข้อมูล Ocean Basemap
    const oceanBasemap = new TileLayer({
      url: 'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer',
      title: 'Ocean Basemap',
      visible: true
    });

    // สร้างชั้นข้อมูล World Street Map
    const worldStreetMap = new TileLayer({
      url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer',
      title: 'World Street Map',
      visible: true
    });

    // สร้างแผนที่
    const map = new Map({
      layers: [oceanBasemap, worldStreetMap]
    });

    // สร้าง MapView
    this.view = new MapView({
      container: 'viewDiv',
      map: map,
      center: [-113, 40], // ศูนย์กลางแผนที่ (Lon, Lat)
      zoom: 5
    });

    // เพิ่ม Swipe widget
    this.view.when(() => {
      if (this.view) {
        const swipe = new Swipe({
          view: this.view,
          leadingLayers: [oceanBasemap], // ชั้นข้อมูลทางซ้าย
          trailingLayers: [worldStreetMap], // ชั้นข้อมูลทางขวา
          position: 50 // เริ่มต้นที่ 50% ของหน้าจอ
        });

        this.view.ui.add(swipe); // เพิ่ม Swipe widget ไปที่ UI
      }
    });
  }
}
