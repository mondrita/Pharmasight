import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DistrictCoordinateResponse } from '../../models/demographic.model';
import { DivisionListView, DivisionView } from '../../models/division.models';
import { MarketShareResponse } from '../../models/market-share.model';
import {
  DrugReportResponse,
  TopBrandResponse,
} from '../../models/top-brands.model';
import { BrandDetailsComponent } from '../brand-details/brand-details.component';
import { TableComponent } from '../table/table.component';
import {MapService} from "../../../../service/map.service";
import {GenericData, SearchParam} from "../../models/search.models";
import {MapComponent} from "../map/map.component";

@Component({
  selector: 'app-show-results',
  standalone: true,
  imports: [TableComponent, BrandDetailsComponent, CommonModule],
  templateUrl: './show-results.component.html',
  styleUrls: ['./show-results.component.css'],
})
export class ShowResultsComponent {
  @Input() divisionName: string = '';
  @Input() isShowDivisionDetails: boolean = false;
  @Input() divisionsDataList: DivisionView[] = [];
  @Input() districtDataList: DistrictCoordinateResponse[] = [];
  @Input() topBrandList: TopBrandResponse[] = [];
  @Input() marketShareList: MarketShareResponse[] = [];
  @Input() showBrandDetails: boolean = false;
  @Input() brandDetailData!: DrugReportResponse;
  @Input() totalBdSales: number = 0;
  @Output() showDistrictsEvent = new EventEmitter<DivisionListView>();
  @Output() goBackEvent = new EventEmitter<void>();
  @Output() tabClickEvent = new EventEmitter<string>();
  @Output() showBrandDetailsEvent = new EventEmitter<number>();
  @Input() searchParamData!: SearchParam;
  @Input() genericData!: GenericData;

  public activeTab: string = 'demographic';
  public isOtherTabsEnabled: boolean = false;

  constructor(private mapService: MapService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['districtDataList'] && changes['districtDataList'].currentValue.length > 0) {
      this.isOtherTabsEnabled = true;
    }
    if (changes['totalBdSales']) {
      console.log('Updated salesToShow in ShowResultsComponent:', changes['totalBdSales'].currentValue);
    }
  }

  onTabClick(tabType: string) {
    if (tabType === 'demographic') {
      this.activeTab = 'demographic';
      this.isOtherTabsEnabled = false;
    } else if (this.isOtherTabsEnabled) {
      this.activeTab = tabType;
    }
    this.tabClickEvent.emit(tabType);
  }

  onShowDistricts(division: DivisionListView) {
    this.isOtherTabsEnabled = true;
    this.activeTab = 'demographic';
    this.tabClickEvent.emit('demographic');
    this.showDistrictsEvent.emit(division);
  }

  onShowBrandDetails(drugId: number) {
    if (!drugId) return;

    const searchParam = {
      drugId: drugId,
      startDate: this.genericData.startDate,
      endDate: this.genericData.endDate,
    };

    this.mapService.getDrugReport(searchParam).subscribe({
      next: (response) => {
        this.brandDetailData = response;
        this.showBrandDetails = true;
      },
      error: (error) => {
        console.error('Error fetching drug report:', error);
      },
    });
  }

  onGoBack() {
    this.showBrandDetails = false;
    this.activeTab = 'demographic';
    this.isOtherTabsEnabled = false;

    this.goBackEvent.emit();
  }

  onDownloadExcel() {
    if (!this.searchParamData || !this.searchParamData.genericId || !this.searchParamData.vendorId) {
      console.error('Missing search parameters for exporting Excel.');
      return;
    }
    const { genericId, vendorId, startDate, endDate } = this.searchParamData;
    const exportParams = {
      genericId,
      vendorId,
      startDate,
      endDate,
      divId: 0,
      limit: 10,
    };
    this.mapService.exportExcel(exportParams).subscribe({
      next: (response) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Division_Report_${startDate}_to_${endDate}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading the Excel file:', error);
      },
    });
  }

}
