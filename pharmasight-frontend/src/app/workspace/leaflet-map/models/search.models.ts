export interface SearchParamForDrugReport {
  startDate: string;
  endDate: string;
  drugId: number;
}
export interface SearchFormParam {
  genericId: number;
  vendorId: number;
  startDate: string;
  endDate: string;
}
export interface SearchParam {
  genericId: number;
  vendorId: number;
  startDate: string;
  endDate: string;
  divId: number;
  limit: number;
}

export interface GenericData {
  genericName: string;
  startDate: string;
  endDate: string;
}
