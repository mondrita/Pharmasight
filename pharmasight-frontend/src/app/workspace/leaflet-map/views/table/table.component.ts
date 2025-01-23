import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DistrictCoordinateResponse } from '../../models/demographic.model';
import { DivisionListView } from '../../models/division.models';
import { MarketShareResponse } from '../../models/market-share.model';
import { TopBrandResponse } from '../../models/top-brands.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() tableTabType: string = '';
  @Input() divisionsDataList: any[] = [];
  @Input() districtDataList: DistrictCoordinateResponse[] = [];
  @Input() topBrandList: TopBrandResponse[] = [];
  @Input() marketShareList: MarketShareResponse[] = [];
  @Output() showDistrictsEvent = new EventEmitter();
  @Output() showBrandDetailsEvent = new EventEmitter();
  public data: any[] = [];
  public divisionName: string = '';
  divisionId: string | null = null;
  public showdistrict: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.data = this.divisionsDataList;

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.tableTabType === 'demographic') {
      if (this.districtDataList.length > 0) {
        this.data = this.districtDataList;
        this.showdistrict = true;
      } else {
        this.data = this.divisionsDataList;
        this.showdistrict = false;
      }
    } else if (this.tableTabType === 'brands') {
      this.data = this.topBrandList;
      this.showdistrict = false;
    } else if (this.tableTabType === 'market_share') {
      this.data = this.marketShareList;
      this.showdistrict = true;
    }
  }
  resetToDivisionsView() {
    this.showdistrict = false;
    this.data = this.divisionsDataList;
  }

  showDistrictsHandler(division: DivisionListView) {
    console.log('divisionId', division);
    if (division) {
      this.showdistrict = true;
    }
    this.showDistrictsEvent.emit(division);
  }

  showBrandDetails(drugId: any) {
    console.log('drugId: ' + drugId);
    this.showBrandDetailsEvent.emit(Number(drugId.id));
  }
  formatNumber(value: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  }
}
