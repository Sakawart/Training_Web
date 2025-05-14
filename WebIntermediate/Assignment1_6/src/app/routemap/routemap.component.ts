import { Component, OnInit } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import Graphic from '@arcgis/core/Graphic';
import * as route from '@arcgis/core/rest/route';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

@Component({
  selector: 'app-routemap',
  templateUrl: './routemap.component.html',
  styleUrls: ['./routemap.component.css'],
})
export class RoutemapComponent implements OnInit {

  view: any;
  routeUrl: string = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/Route";
  routeDirections: any[] = [];
  graphics: any[] = [];
  isStartRouteButtonVisible: boolean = false;  // ตัวแปรแสดงปุ่ม Start Route
  selectedDirectionIndex: number = -1;  // ตัวแปรเก็บ index ของ direction ที่ถูกเลือก

  constructor() { }

  ngOnInit(): void {
    this.initializeMap();
  }

  // ฟังก์ชันในการเริ่มต้นแผนที่
  initializeMap(): void {
    const map = new Map({
      basemap: "streets-navigation-vector",
    });

    this.view = new MapView({
      container: 'viewDiv',
      map: map,
      center: [-117.1625, 32.715], // ศูนย์กลางแผนที่
      zoom: 10,
    });

    this.view.when(() => {
      this.view.on('click', this.onMapClick.bind(this));
    });
  }

  // ฟังก์ชันสำหรับคลิกบนแผนที่
  onMapClick(event: any): void {
    if (this.graphics.length < 10) {  // จำกัดจำนวนจุดที่สามารถคลิกได้
      this.addGraphic(event.mapPoint);
    }

    // ถ้ามีจุดครบ 2 จุดขึ้นไป แสดงปุ่ม Start Route
    if (this.graphics.length >= 2) {
      this.isStartRouteButtonVisible = true;
    }
  }

  // ฟังก์ชันสำหรับเพิ่มกราฟิก (Marker) ลงบนแผนที่
  addGraphic(point: any): void {
    let symbol;
    
    // ใช้รูป location-pin-red สำหรับจุดแรกสุด
    if (this.graphics.length === 0) {
      symbol = new PictureMarkerSymbol({
        url: "assets/location-pin-red.png",  // ระบุพาธของไฟล์ PNG
        width: "24px",
        height: "24px"
      });
    } else {
      // ใช้รูป location-pin-blue สำหรับจุดที่เหลือ
      symbol = new PictureMarkerSymbol({
        url: "assets/location-pin-blue.png",  // ระบุพาธของไฟล์ PNG
        width: "24px",
        height: "24px"
      });
    }
  
    const graphic = new Graphic({
      geometry: point,
      symbol: symbol
    });
  
    this.graphics.push(graphic);
    this.view.graphics.add(graphic);
  }
  
  // ฟังก์ชันเริ่มต้นการคำนวณเส้นทาง
  startRoute(): void {
    if (this.graphics.length >= 2) {
      this.getRoute();
      this.isStartRouteButtonVisible = false;
    }
  }

  // ฟังก์ชันดึงข้อมูลเส้นทางจาก ArcGIS
  getRoute(): void {
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: this.graphics
      }),
      returnDirections: true
    });

    route.solve(this.routeUrl, routeParams)
      .then((data: any) => {
        data.routeResults.forEach((result: any) => {
          result.route.symbol = new SimpleLineSymbol({
            color: [5, 150, 255],
            width: 3
          });
          this.view.graphics.add(result.route);
        });

        // เก็บข้อมูลทิศทาง
        this.routeDirections = data.routeResults[0].directions.features.map((direction: any) => {
          return {
            text: direction.attributes.text,
            length: direction.attributes.length,
            geometry: direction.geometry
          };
        });

        console.log(this.routeDirections);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  // ฟังก์ชันที่ใช้ในการเลือกทิศทาง
  highlightDirection(direction: any, index: number): void {
    // เน้นข้อความที่คลิก
    this.selectedDirectionIndex = index;

    // เลือกเฉพาะเส้นทางของ direction ที่คลิก
    const polyline = direction.geometry;
    if (polyline) {
      this.view.goTo({
        target: polyline.extent,
        zoom: 14
      }).catch((error: any) => {
        console.error('Zoom failed: ', error);
      });
    }
  }

  // ฟังก์ชันล้างทุกอย่าง
  clearAll(): void {
    this.view.graphics.removeAll();
    this.graphics = [];
    this.routeDirections = [];
    this.isStartRouteButtonVisible = false;
    this.selectedDirectionIndex = -1;  // รีเซ็ตการเลือก
  }
}
