import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import TileLayer from '@arcgis/core/layers/TileLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import LayerList from '@arcgis/core/widgets/LayerList';

@Component({
  selector: 'app-layermap',
  templateUrl: './layermap.component.html',
  styleUrls: ['./layermap.component.css']
})
export class LayermapComponent implements OnInit {

  view: MapView | undefined;

  constructor() { }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    // สร้างชั้นข้อมูล World Ocean Base
    const oceanBasemap = new TileLayer({
      url: 'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer',
      title: 'World Ocean Base',
      visible: true
    });

    // สร้างชั้นข้อมูล Census
    const censusLayer = new MapImageLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer',
      title: 'Census',
      sublayers: [
        { id: 0, title: 'Census Block Points', visible: false },
        { id: 1, title: 'Census Block Group', visible: true },
        { id: 2, title: 'Detailed Counties', visible: false },
        { id: 3, title: 'states', visible: true }
      ]
    });

    // สร้างแผนที่
    const map = new Map({
      layers: [oceanBasemap, censusLayer]
    });

    // สร้าง MapView
    this.view = new MapView({
      container: 'viewDiv',
      map: map,
      center: [-117, 34], // ศูนย์กลางแผนที่ (Lon, Lat)
      zoom: 10
    });

    // เพิ่ม LayerList
    this.view.when(() => {
      if (this.view) {
        const layerList = new LayerList({
          view: this.view,
          listItemCreatedFunction: (event) => {
            const item = event.item;
            item.open = true; // เปิดการแสดงรายการย่อยใน LayerList
          }
        });

        this.view.ui.add(layerList, 'top-right'); // เพิ่ม LayerList ไปยังมุมขวาบน
      }
    });
  }
}
