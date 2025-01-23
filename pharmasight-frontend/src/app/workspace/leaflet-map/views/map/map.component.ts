import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import L from 'leaflet';
import { HelperService } from '../../../../service/helper.service';
import { DivisionView } from '../../models/division.models';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnChanges {
  @Input() divisionsDataList: DivisionView[] | [] = [];
  @Input() districtDataList: any[] = [];
  @Input() boundary: any = null;
  @Input() isShowDivisionDetails: boolean = false;
  @Output() showDistrictsEvent = new EventEmitter();
  @Output() divisionPopupClicked = new EventEmitter<DivisionView>();

  private map: any;
  private cityMarkers: L.Marker[] = [];
  private currentBoundaryLayer: any;

  public divisions = [
    { divisionName: 'Dhaka', latitude: '23.8103', longitude: '90.4125' },
    { divisionName: 'Chittagong', latitude: '22.3569', longitude: '91.7832' },
    { divisionName: 'Khulna', latitude: '22.8456', longitude: '89.5403' },
    { divisionName: 'Rajshahi', latitude: '24.3636', longitude: '88.6241' },
    { divisionName: 'Sylhet', latitude: '24.9045', longitude: '91.8611' },
    { divisionName: 'Barishal', latitude: '22.701', longitude: '90.3535' },
    { divisionName: 'Rangpur', latitude: '25.7439', longitude: '89.2752' },
    { divisionName: 'Mymensingh', latitude: '24.7471', longitude: '90.4203' },
  ];


  constructor(private helperService: HelperService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['divisionsDataList'] && !changes['divisionsDataList'].isFirstChange()) {
      this.renderDivisionMarkers();
    }

    if (changes['districtDataList'] && !changes['districtDataList'].isFirstChange()) {
      console.log('Updated districtDataList:', changes['districtDataList'].currentValue);
      this.renderDistrictMarkers();
    }

    if (changes['boundary'] && !changes['boundary'].isFirstChange()) {
      this.updateBoundary();
    }
  }


  //initializing
  public loadDefaultDivisionMarkers(): void {
    this.divisionsDataList = this.divisions;
    if (this.map) {
    this.clearDivisionPopups();
    this.clearBoundary();
    this.renderDivisionMarkers(false);
  }
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([23.8103, 90.4125], 8);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    if (this.divisionsDataList.length > 0) {
      this.renderDivisionMarkers();
    }
  }

  //division info rendering:
  public renderDivisionMarkers(showPopups: boolean = true): void {
    this.clearDivisionPopups();
    this.clearBoundary();

    this.divisions.forEach((staticDivision) => {
      const apiDivision = this.divisionsDataList.find(
          (division) => division.divisionName === staticDivision.divisionName
      );

      const popupContent = `
      <div class="division-popup-content">
        <p class="division-name">${staticDivision.divisionName}</p>
        <p class="sales-data">৳${apiDivision?.totalSales?.toLocaleString('en-US') || '0'}</p>
      </div>
    `;

      const marker = L.marker([
        Number(staticDivision.latitude),
        Number(staticDivision.longitude),
      ]).addTo(this.map);

      marker.on('click', () => {
        if (apiDivision?.divisionName) {
          this.divisionPopupClicked.emit({
            divisionId: String(apiDivision.divisionId || staticDivision.divisionName || ''), // Fallback to divisionName or empty string
            divisionName: apiDivision.divisionName,
            totalSales: apiDivision?.totalSales || 0,
          });
        } else {
          console.error('Invalid or missing divisionId:', {
            divisionName: staticDivision.divisionName,
            latitude: staticDivision.latitude,
            longitude: staticDivision.longitude,
            totalSales: apiDivision?.totalSales || 0,
          });
        }
      });

      this.cityMarkers.push(marker);

      if (showPopups) {
        const popup = L.popup({
          closeButton: false,
          autoClose: false,
          className: 'division-popup',
        })
            .setLatLng([Number(staticDivision.latitude), Number(staticDivision.longitude)])
            .setContent(popupContent);

        this.map.addLayer(popup);
      }
    });
  }

  public clearDivisionPopups(): void {
    console.log('Clearing division popups:', this.cityMarkers.length);
    this.cityMarkers.forEach((marker) => {
      if (this.map.hasLayer(marker)) {
        this.map.removeLayer(marker);
      }
    });
    this.cityMarkers = [];
    this.map.eachLayer((layer:any) => {
      if (layer instanceof L.Popup) {
        this.map.removeLayer(layer);
      }
    });
    console.log('Division popups cleared.');
  }

  //district info rendering:
  public updateDistrictMarkers(districtDataList: any[]): void {
    this.clearDivisionPopups();
    this.districtDataList = districtDataList;
    this.renderDistrictMarkers();
    console.log('District markers updated.');
  }

  private renderDistrictMarkers(): void {
    this.districtDataList.forEach((district) => {
      const popupContent = `
      <div class="district-popup-content">
        <p>${district.districtName}</p>
        <p>৳${district.districtSales || 0}</p>
      </div>
    `;
      const popup = L.popup({
        closeButton: false,
        autoClose: false,
        className: 'district-popup',
      })
          .setLatLng([Number(district.latitude), Number(district.longitude)])
          .setContent(popupContent)
          .openOn(this.map);
    });
  }

  //boundary rendering:
  private updateBoundary(): void {
    if (this.currentBoundaryLayer) {
      this.map.removeLayer(this.currentBoundaryLayer);
    }

    this.currentBoundaryLayer = L.geoJSON(this.boundary.geoData, {
      style: () => ({
        color: '#5f9354',
        weight: 2,
        fillOpacity: 0.2,
        fillColor: '#9af189',
      }),
    }).addTo(this.map);

    this.map.fitBounds(this.currentBoundaryLayer.getBounds());
  }

  public clearBoundary(): void {
    if (this.currentBoundaryLayer) {
      this.map.removeLayer(this.currentBoundaryLayer);
      this.currentBoundaryLayer = null;
      console.log('Boundary cleared.');
    }
    this.map.setView([23.8103, 90.4125], 8);
    console.log('Map view reset to initial state.');
  }

}
