import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { HelperService } from '../../../../service/helper.service';
import { MapService } from '../../../../service/map.service';
import { DistrictCoordinateResponse } from '../../models/demographic.model';
import { DivisionListView, DivisionView } from '../../models/division.models';
import { MarketShareResponse } from '../../models/market-share.model';
import {GenericData, SearchFormParam, SearchParam} from '../../models/search.models';
import { TopBrandResponse } from '../../models/top-brands.model';
import { MapComponent } from '../../views/map/map.component';
import {SearchFormComponent} from "../../views/search-form/search-form.component";
import {ShowResultsComponent} from "../../views/show-results/show-results.component";
import {forkJoin} from "rxjs";
import {NgIf} from "@angular/common";
import {MenuComponent} from "../../views/menu/menu.component";

@Component({
  selector: 'app-leaflet-map-container',
  standalone: true,
  imports: [MapComponent, SearchFormComponent, ShowResultsComponent,MenuComponent, NgIf],
  templateUrl: './leaflet-map-container.component.html',
  styleUrls: ['./leaflet-map-container.component.css'],
})
export class LeafletMapContainerComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;


  public boundary: any = null;
  public isOpenSearchForm: boolean = false;
  public isShowDivisionDetails: boolean = false;
  public isShowResults: boolean = false;
  public divisionsDataList: DivisionView[] = [];
  public topBrandList: TopBrandResponse[] = [];
  public marketShareList: MarketShareResponse[] = [];
  public storeDivisionsList: DivisionView[] = [];
  public districtDataList: DistrictCoordinateResponse[] = [];
  public divisionName: string = '';
  public searchParamData: any;
  public divisionId: any;
  public genericData: GenericData = {
    genericName: '',
    startDate: '',
    endDate: '',
  };

  constructor(
      private mapService: MapService,
      private cdr: ChangeDetectorRef,
      private helperService: HelperService
  ) {}

  public totalBdSales: number = 0;
  public divisionSales: number = 0;
  public salesToShow: number = 0;

  ngOnInit() {
    this.helperService.removeTabItem();
    this.salesToShow = this.totalBdSales;
  }
  ngAfterViewInit(): void {
    if (this.mapComponent) {
      this.mapComponent.loadDefaultDivisionMarkers();
      this.mapComponent.divisionPopupClicked.subscribe((division: DivisionListView) => {
        console.log('Popup clicked. Division data:', division);
        this.getDistrictCoordinates(division);
      });
    } else {
      console.error('MapComponent not initialized.');
    }
  }

  handleGoBack() {
    if (this.mapComponent) {
      this.mapComponent.clearDivisionPopups();
      this.mapComponent.renderDivisionMarkers();
    }
  }


  openModal() {
    this.isOpenSearchForm = true;
  }

  closeModal() {
    this.isOpenSearchForm = false;
  }

  searchHandler(searchData: SearchFormParam) {
    this.searchParamData = {
      genericId: Number(searchData.genericId),
      vendorId: Number(searchData.vendorId),
      startDate: searchData.startDate,
      endDate: searchData.endDate,
    };

    const tabType = this.helperService.getTabItem() || 'demographic';
    this.getTabWiseData(tabType);

  }
  getTabWiseData(tabType: string) {
    const paramObj = {
      ...this.searchParamData,
      divId: this.divisionId || localStorage.getItem('divisionId'),
      limit: 10,
    };

    if (tabType === 'demographic') {
      this.isShowDivisionDetails = false;
      this.getDivisionWiseData(this.searchParamData);
    } else if (tabType === 'brands') {
      this.getBrandsData(paramObj);
    } else if (tabType === 'market_share') {
      this.getMarketShareData(paramObj);
    }
  }


  public getDivisionWiseData(searchParamData: SearchParam) {
    this.mapService.getDivisionWiseData(searchParamData).subscribe({
      next: (response: any) => {
        this.storeDivisionsList = response?.divisionSales;
        this.divisionsDataList = response?.divisionSales;
        this.totalBdSales = response?.totalBDSales || 0;
        if (!this.isShowDivisionDetails) {
          this.salesToShow = this.totalBdSales;
        }
        this.districtDataList = [];
        this.topBrandList = [];
        this.marketShareList = [];
        this.isShowResults = true;
        console.log('res', response);
        console.log('res divisionsList', this.divisionsDataList);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public getDistrictCoordinates(division: DivisionListView): void {
    console.log('Division clicked:', division);

    this.divisionSales = division?.totalSales || 0;
    this.salesToShow = this.divisionSales;
    this.isShowDivisionDetails = true;

    const divisionId = division?.divisionId;
    if (!divisionId || isNaN(Number(divisionId))) {
      console.error('Invalid or missing divisionId:', division);
      return;
    }

    const divisionName = division.divisionName;
    this.divisionId = Number(divisionId);
    this.divisionName = divisionName;

    localStorage.setItem('divisionId', String(this.divisionId));
    this.mapComponent.clearDivisionPopups();
    this.mapComponent.clearBoundary();

    const districtCoordinates$ = this.mapService.getDistrictCoordinates(this.divisionId);
    const districtwiseSearch$ = this.mapService.getDistrictwiseSearch({
      genericId: this.searchParamData.genericId,
      vendorId: this.searchParamData.vendorId,
      startDate: this.searchParamData.startDate,
      endDate: this.searchParamData.endDate,
      divId: this.divisionId,
      limit: 10,
    });
    const boundary$ = this.mapService.getBoundary(divisionName);

    forkJoin([districtCoordinates$, districtwiseSearch$, boundary$]).subscribe({
      next: ([districtCoordinates, districtwiseSearch, boundary]) => {
        console.log('District Coordinates:', districtCoordinates);
        console.log('District Sales Data:', districtwiseSearch);

        this.districtDataList = districtCoordinates.map((district) => {
          const matchingSalesData = districtwiseSearch.find(
              (sales) => sales.districtName === district.districtName
          );
          return {
            ...district,
            districtSales: matchingSalesData ? matchingSalesData.districtSales : 0,
          };
        });

        this.districtDataList.sort((a, b) => (b.districtSales || 0) - (a.districtSales || 0));

        this.boundary = boundary;
        this.isShowDivisionDetails = true;

        if (this.mapComponent) {
          //this.mapComponent.clearDivisionPopups();
          this.mapComponent.updateDistrictMarkers(this.districtDataList);
        }
        this.isShowResults = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }


  public getDistrictwiseSearch(paramObj: SearchParam) {
    this.mapService.getDistrictwiseSearch(paramObj).subscribe({
      next: (response) => {
        if (response) {
          this.isShowDivisionDetails = true;
          this.districtDataList = this.districtDataList.map((district) => {
            return {
              ...district,
              districtSales: response.find(
                  (dist: any) => dist.districtName === district?.districtName
              )?.districtSales,
            };
          });
          this.divisionsDataList = [];
          this.topBrandList = [];
          this.marketShareList = [];
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  showPreviousData(data: any) {
    if (data === 'back') {
      this.helperService.setTabItem('demographic');
      this.divisionsDataList = this.storeDivisionsList;
      this.salesToShow = this.totalBdSales;
      this.isShowDivisionDetails = false;
      this.divisionName = '';
    }
  }

  getBrandsData(topBrandSearchParam: SearchParam) {
    this.mapService.getTopBrandsSearch(topBrandSearchParam).subscribe({
      next: (response) => {
        this.topBrandList = response;
        this.districtDataList = [];
        this.marketShareList = [];
        this.divisionId = '';
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getMarketShareData(marketShareSearchParam: SearchParam) {
    this.mapService.getMarketShareSearch(marketShareSearchParam).subscribe({
      next: (response) => {
        this.marketShareList = response;
        this.marketShareList.sort((a, b) => (b.salesPercentage || 0) - (a.salesPercentage || 0));
        this.divisionId = '';
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateGenericData(newGenericData: GenericData) {
    this.genericData = { ...newGenericData };
  }
}
