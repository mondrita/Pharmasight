import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  SearchParam,
  SearchParamForDrugReport,
} from '../workspace/leaflet-map/models/search.models';
import {
  DistrictCoordinateResponse,
  DistrictWiseResponse,
} from '../workspace/leaflet-map/models/demographic.model';
import { MarketShareResponse } from '../workspace/leaflet-map/models/market-share.model';
import {
  DrugReportResponse,
  TopBrandResponse,
} from '../workspace/leaflet-map/models/top-brands.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly FETCH_SALES_DEMOGRAPHIC = '/sales-info/demographic';
  private readonly DISTRICT_COORDINATES='/division/district-coordinates';
  private readonly FETCH_SALES_DISTRICTS='/sales-info/demographic-districts';
  private readonly FETCH_TOP_BRANDS='/sales-info/top-brands';
  private readonly FETCH_MARKET_SHARE='/sales-info/district-market-share';
  private readonly FETCH_DRUG_REPORT='/sales-info/Drug-report';
  private readonly FETCH_DIVISION_BOUNDARY='/division/boundary';
  private readonly FETCH_VENDOR_SEARCH='/vendor/search';
  private readonly FETCH_GENERIC_SEARCH='/generic/search';

  constructor(private http: HttpClient) {}

  // Divisionwise data
  getDivisionWiseData(searchParam: SearchParam): Observable<any> {
    let params = new HttpParams()
        .append('genericId', searchParam.genericId)
        .append('vendorId', searchParam.vendorId)
        .append('startDate', searchParam.startDate)
        .append('endDate', searchParam.endDate);

    return this.http.get<any[]>(this.FETCH_SALES_DEMOGRAPHIC, { params });
  }

  // District coordinates
  getDistrictCoordinates(divisionId: number): Observable<DistrictCoordinateResponse[]> {
    let params = new HttpParams().append('divisionId', divisionId.toString());

    return this.http.get<DistrictCoordinateResponse[]>(this.DISTRICT_COORDINATES, { params });
  }

  // Districtwise search
  getDistrictwiseSearch(searchParam: SearchParam): Observable<DistrictWiseResponse[]> {
    let params = new HttpParams()
        .append('divisionId', searchParam.divId)
        .append('genericId', searchParam.genericId)
        .append('vendorId', searchParam.vendorId)
        .append('startDate', searchParam.startDate)
        .append('endDate', searchParam.endDate);

    return this.http.get<DistrictWiseResponse[]>(this.FETCH_SALES_DISTRICTS, { params });
  }

  // Top brands search
  getTopBrandsSearch(searchParam: SearchParam): Observable<TopBrandResponse[]> {
    let params = new HttpParams()
        .append('genericId', searchParam.genericId)
        .append('vendorId', searchParam.vendorId)
        .append('startDate', searchParam.startDate)
        .append('endDate', searchParam.endDate)
        .append('divisionId', searchParam.divId)
        .append('limit', searchParam.limit?.toString() || '');

    return this.http.get<TopBrandResponse[]>(this.FETCH_TOP_BRANDS, { params });
  }

  // Market share search
  getMarketShareSearch(searchParam: SearchParam): Observable<MarketShareResponse[]> {
    let params = new HttpParams()
        .append('genericId', searchParam.genericId)
        .append('vendorId', searchParam.vendorId)
        .append('startDate', searchParam.startDate)
        .append('endDate', searchParam.endDate)
        .append('divisionId', searchParam.divId);

    return this.http.get<MarketShareResponse[]>(this.FETCH_MARKET_SHARE, { params });
  }

  // Drug report
  getDrugReport(searchParam: SearchParamForDrugReport): Observable<DrugReportResponse> {
    let params = new HttpParams()
        .append('drugId', searchParam.drugId)
        .append('startDate', searchParam.startDate)
        .append('endDate', searchParam.endDate);

    return this.http.get<DrugReportResponse>(this.FETCH_DRUG_REPORT, { params });
  }

  // Boundary region
  getBoundary(name: string): Observable<any> {
    let params = new HttpParams().append('name', name);

    return this.http.get<any[]>(this.FETCH_DIVISION_BOUNDARY, { params });
  }

  // Generic suggestions
  getGenericSuggestions(query: string): Observable<any> {
    let params = new HttpParams()
        .append('prefix', query)
        .append('limit', '10');

    return this.http.get<any[]>(this.FETCH_GENERIC_SEARCH, { params });
  }

  // Vendor suggestions
  getVendorSuggestions(query: string): Observable<any[]> {
    let params = new HttpParams()
        .append('prefix', query)
        .append('limit', '10');

    return this.http.get<any[]>(this.FETCH_VENDOR_SEARCH, { params });
  }

  exportExcel(searchParam: SearchParam): Observable<Blob> {
    const params = new HttpParams()
        .append('genericId', searchParam.genericId)
        .append('vendorId', searchParam.vendorId)
        .append('startDate', searchParam.startDate)
        .append('endDate', searchParam.endDate);

    return this.http.get('/export-excel', { params, responseType: 'blob' });
  }
}
