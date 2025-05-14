import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as closestFacility from '@arcgis/core/rest/closestFacility';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import ClosestFacilityParameters from '@arcgis/core/rest/support/ClosestFacilityParameters';

@Component({
  selector: 'app-buffermap',
  templateUrl: './buffermap.component.html',
  styleUrls: ['./buffermap.component.css'],
})
export class BuffermapComponent implements OnInit {
  @ViewChild('mapView', { static: true }) mapViewElement!: ElementRef;
  mapView!: MapView;
  cities: { cityName: string; geometry: any }[] = [];
  incidentGraphic!: Graphic;
  bufferGraphic!: Graphic;
  markerGraphics: Graphic[] = [];
  private markerGraphic: Graphic | null = null

  private facilitiesLayer = new FeatureLayer({
    url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0',
  });

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    const map = new Map({
      basemap: 'streets-vector',
    });

    this.mapView = new MapView({
      container: this.mapViewElement.nativeElement,
      map: map,
      center: [-117.1625, 32.715],
      zoom: 10,
    });

    map.add(this.facilitiesLayer);
    this.mapView.on('click', (event) => this.onMapClick(event.mapPoint));
  }

  onMapClick(mapPoint: Point): void {
    this.mapView.graphics.removeAll();
    this.createIncidentGraphic(mapPoint);
    this.createBuffer(mapPoint);
    this.queryFacilities(mapPoint);
  }

  createIncidentGraphic(mapPoint: Point): void {
    this.incidentGraphic = new Graphic({
      geometry: mapPoint,
      symbol: new SimpleMarkerSymbol({
        color: 'red',
        size: '12px',
        outline: { color: 'white', width: 2 },
      }),
      attributes: { name: 'Incident' },
    });
    this.mapView.graphics.add(this.incidentGraphic);
  }

  createBuffer(mapPoint: Point): void {
    const buffer = geometryEngine.buffer(mapPoint, 20, 'kilometers');
    const bufferGeometry = Array.isArray(buffer) ? buffer[0] : buffer; // ตรวจสอบว่า buffer เป็น Array หรือไม่
    this.bufferGraphic = new Graphic({
      geometry: bufferGeometry,
      symbol: new SimpleFillSymbol({
        color: [255, 165, 0, 0.4],
        outline: { color: 'orange', width: 2 },
      }),
    });

    this.mapView.graphics.add(this.bufferGraphic);
  }

  queryFacilities(mapPoint: Point): void {
    const query = this.facilitiesLayer.createQuery();
    query.geometry = this.bufferGraphic.geometry;
    query.spatialRelationship = 'intersects';
    query.returnGeometry = true;

    this.facilitiesLayer.queryFeatures(query).then((results) => {
      const facilities = results.features.map((feature) => {
        const graphic = new Graphic({
          geometry: feature.geometry,
          symbol: new SimpleMarkerSymbol({
            style: 'square',
            color: 'orange',
            size: '10px',
            outline: { color: 'white', width: 1 },
          }),
          attributes: { name: feature.attributes.areaname }, // ใช้ฟิลด์ areaname
        });
        this.mapView.graphics.add(graphic);
        return graphic;
      });

      this.findClosestFacilities(facilities);
    });
  }

  findClosestFacilities(facilities: Graphic[]): void {
    const params = new ClosestFacilityParameters({
      incidents: new FeatureSet({ features: [this.incidentGraphic] }),
      facilities: new FeatureSet({ features: facilities }),
      returnRoutes: true,
      defaultTargetFacilityCount: 10, // กำหนดให้ได้ผลลัพธ์ 10 เส้นทาง
    });

    closestFacility
      .solve(
        'https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/ClosestFacility',
        params
      )
      .then((response) => {
        this.cities = []; // ล้างข้อมูลเมืองเก่าก่อน
        response.routes.features.slice(0, 10).forEach((route) => {
          // กรองเฉพาะ 10 เมืองแรก
          const routeGraphic = new Graphic({
            geometry: route.geometry,
            symbol: new SimpleLineSymbol({
              color: 'blue',
              width: 1,
            }),
          });

          this.mapView.graphics.add(routeGraphic);

          this.cities.push({
            cityName: route.attributes.Name, // ใช้ชื่อเมืองจาก Attributes
            geometry: route.geometry,
          });
        });
      });
  }

  highlightCity(city: any): void {
    // ลบกราฟิกเดิมทั้งหมด (ยกเว้น Incident)
    this.mapView.graphics.removeAll();
    this.mapView.graphics.add(this.incidentGraphic); // เพิ่ม Incident กลับมา

    // สร้าง Marker ใหม่สำหรับเมืองที่เลือก (จุดปลายทาง)
    this.markerGraphic = new Graphic({
      geometry: city.geometry,
      symbol: new SimpleMarkerSymbol({
        style: 'square',
        color: 'orange',
        size: '10px',
        outline: { color: 'white', width: 2 },
      }),
    });

    // ถ้ามี markerGraphic เก่าก็ลบออกก่อน
    if (this.markerGraphic) {
      this.mapView.graphics.remove(this.markerGraphic);
    } else {
      // เพิ่มจุดนี้ไปยังแผนที่
      this.mapView.graphics.add(this.markerGraphic);
    }

    // เพิ่มเส้นทางของเมืองที่ถูกเลือก (เฉพาะเส้นทางจาก Incident ไปยังเมือง)
    const highlightGraphic = new Graphic({
      geometry: city.geometry,
      symbol: new SimpleLineSymbol({
        color: 'black',
        width: 3,
      }),
    });
    this.mapView.graphics.add(highlightGraphic);

    // ซูมไปยังตำแหน่งเมืองที่เลือก
    this.mapView.goTo({
      target: city.geometry,
      zoom: 12,
    });

    // อัปเดตการแสดงผลไฮไลต์ชื่อเมืองใน Panel
    const cityElements = document.querySelectorAll('.ul-container li');
    cityElements.forEach((el) => {
      // ปรับข้อความที่แสดงใน Panel ให้แสดงเฉพาะชื่อเมือง
      if (el.textContent?.trim() === city.cityName.trim()) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });

    const cityName = city.cityName
    console.log(`Highlighted city: ${cityName}`)
  }
}
