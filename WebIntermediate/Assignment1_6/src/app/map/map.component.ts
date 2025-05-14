import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Map from '@arcgis/core/Map';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as identify from '@arcgis/core/rest/identify';
import IdentifyParameters from '@arcgis/core/rest/support/IdentifyParameters';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
  map!: Map;
  mapView: MapView | undefined;
  featureLayer: FeatureLayer;
  states: any[] = [];
  selectedState: any = null;

  constructor() {
    this.featureLayer = new FeatureLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2'
    });
  }

  ngOnInit(): void {
    this.map = new Map({
      basemap: 'streets',
    });

    this.mapView = new MapView({
      container: this.mapPanel.nativeElement,
      map: this.map,
      center: [100, 13],
      zoom: 4
    });

    this.map.add(this.featureLayer);

    this.queryStates();
  }

  queryStates(): void {
    const query = this.featureLayer.createQuery();
    query.where = '1=1';
    query.returnGeometry = true;
    query.outFields = ['state_name', 'state_abbr', 'sub_region']; // ใช้ชื่อฟิลด์ที่ถูกต้อง
  
    this.featureLayer.queryFeatures(query).then((response) => {
      console.log(response.features); // ตรวจสอบข้อมูล
      this.states = response.features; // เก็บข้อมูลใน states
    });
  }
  
  onRowClick(state: any): void {
    this.selectedState = state;

    // สร้าง Polygon และสัญลักษณ์
    const polygon = state.geometry;
    const symbol = new SimpleFillSymbol({
      color: [255, 165, 0, 0.5],
      outline: {
        color: [255, 165, 0, 0.3],  
        width: 2
      }
    });

    const graphic = new Graphic({
      geometry: polygon,
      symbol: symbol
    });

    this.mapView?.graphics.removeAll();
    this.mapView?.graphics.add(graphic);

    this.mapView?.goTo({
      target: polygon.extent.expand(1.5),
      zoom: 6
    });
  }


}