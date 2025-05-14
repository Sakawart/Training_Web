import { Component, ViewChild } from '@angular/core';
import { LocatorComponent } from './locator/locator.component';
import { CustomPoint } from './custom-point/custom-poin.module';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Map from '@arcgis/core/Map';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as identify from '@arcgis/core/rest/identify';
import IdentifyParameters from '@arcgis/core/rest/support/IdentifyParameters';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '';
  @ViewChild(LocatorComponent) locatorComponent!: LocatorComponent;

  mapView: MapView | null = null;
  map: Map;
  identifyLayer: MapImageLayer;
  identifyURL: string = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';
  stateLayer: FeatureLayer;

  constructor() {
    this.map = new Map({
      basemap: 'streets',
    });

    this.identifyLayer = new MapImageLayer({
      url: this.identifyURL,
    });

    this.stateLayer = new FeatureLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3',
    });

    this.map.add(this.identifyLayer);
    this.map.add(this.stateLayer);
  }

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.mapView = new MapView({
      container: 'mapViewDiv',
      map: this.map,
      center: [100, 13],
      zoom: 5
    });

    this.mapView.on('click', (event) => this.handleMapClick(event));
  }

  handleMapClick(event: any) {
    const mapPoint = event.mapPoint;
    const latitude = mapPoint.latitude;
    const longitude = mapPoint.longitude;

    // ส่งข้อมูลพิกัดไปยัง LocatorComponent
    if (this.locatorComponent) {
      this.locatorComponent.latitude = latitude;
      this.locatorComponent.longitude = longitude;
    }

    // เพิ่มจุด (graphic) บนแผนที่
    this.addGraphic(latitude, longitude);

    // เรียกใช้งาน Identify
    this.executeIdentify(mapPoint);
  }

  highlightByStateName(stateName: string) {
    if (this.mapView) {
      this.mapView.graphics.removeAll();
  
      this.stateLayer.queryFeatures({
        where: `STATE_NAME = '${stateName}'`,
        outFields: ['STATE_NAME', 'Shape_Area', 'POP2007'],
        returnGeometry: true,
      }).then((response: any) => {
        const features = response.features;
        let totalPopulation = 0;
  
        features.forEach((feature: any) => {
          const highlightSymbol = {
            type: 'simple-fill',
            color: [255, 165, 0, 0.3], //สีส้ม
            outline: {
              color: [255, 165, 0, 0.3],
              width: 2,
            },
          };
  
          const highlightGraphic = new Graphic({
            geometry: feature.geometry,
            symbol: highlightSymbol,
          });
  
          if (this.mapView) {
            this.mapView.graphics.add(highlightGraphic);
          }
  
          // ดึงข้อมูลพื้นที่ Shape_Area และ POP2007 (จำนวนประชากร)
          const area = feature.attributes.Shape_Area;
          const population = feature.attributes.POP2007;
  
          // รวมจำนวนประชากรจากทุกฟีเจอร์
          totalPopulation += population;
  
          // กำหนดเนื้อหาของ popupTemplate รวมถึงพื้นที่และประชากร
          feature.popupTemplate = {
            title: `${stateName}`,
            content: `
              <b>ชื่อรัฐ:</b> ${stateName}<br/>
              <b>ประชากรในปี 2007:</b> ${population}<br/>
              <b>พื้นที่:</b> ${area} ตารางกิโลเมตร
            `,
          };
  
          if (this.mapView) {
            this.mapView.popup.open({
              features: [feature],
              location: feature.geometry.centroid, // กำหนดตำแหน่งสำหรับ popup
            });
          }
        });
  
        // แสดงผลรวมจำนวนประชากรทั้งหมด
        // console.log(`รวมประชากรของ ${stateName}: ${totalPopulation}`);
      }).catch((error: any) => {
        console.error('Error highlighting features:', error);
      });
    }
  }
  
  executeIdentify(mapPoint: any) {
    if (this.mapView) {
      const params = new IdentifyParameters();
      params.tolerance = 5;
      params.returnGeometry = true;
      params.layerOption = 'top';
      params.width = this.mapView.width;
      params.height = this.mapView.height;
      params.geometry = mapPoint;
      params.mapExtent = this.mapView.extent;
  
      identify
        .identify(this.identifyURL, params)
        .then((response: any) => {
          const results = response.results;
  
          if (results.length > 0) {
            results.forEach((result: any) => {
              const feature = result.feature;
              const attributes = feature.attributes;
              const stateName = attributes.STATE_NAME;
  
              this.highlightByStateName(stateName);
  
              // feature.popupTemplate = {
              //   title: `${stateName}`,
              //   content: `
              //     <b>ชื่อรัฐ:</b> ${stateName}<br/>
              //     <b>ประชากรในปี 2007:</b> ${attributes.POP2007}<br/>
              //     <b>พื้นที่:</b> ${attributes.Shape_Area}
              //   `,
  
              // };
  
              if (this.mapView) {
                this.mapView.popup.open({
                  features: [feature],
                  location: mapPoint,
                });
              }
            });
          } else {
            if (this.mapView) {
              this.mapView.popup.open({
                title: 'No Results',
                content: 'ไม่มีข้อมูลในจุดที่คุณคลิก',
                location: mapPoint,
              });
            }
          }
        })
        .catch((error: any) => {
          console.error('Identify Error:', error);
          if (this.mapView) {
            this.mapView.popup.open({
              title: 'Error',
              content: 'เกิดข้อผิดพลาดในการดึงข้อมูล Identify',
              location: mapPoint,
            });
          }
        });
    }
  }

  onLocate(customPoint: CustomPoint) {
    if (this.mapView) {
      const { latitude, longitude } = customPoint;
      this.mapView.goTo([longitude, latitude]);
      this.mapView.graphics.removeAll();
      this.addGraphic(latitude, longitude);
    }
  }

  addGraphic(latitude: number, longitude: number) {
    const point = new Point({
      longitude: longitude,
      latitude: latitude,
    });

    const symbol = new SimpleMarkerSymbol({
      color: 'red',
      size: '12px',
      outline: {
        color: 'white',
        width: 2,
      },
    });

    const graphic = new Graphic({
      geometry: point,
      symbol: symbol,
    });

    if (this.mapView) {
      this.mapView.graphics.removeAll();
      this.mapView.graphics.add(graphic);
    }
  }



}
