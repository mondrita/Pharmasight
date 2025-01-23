export interface TopBrandResponse {
  drugName: string;
  strengthName: string;
  formationName: string;
  totalAmount: number;
}
export interface DrugReportResponse {
  drugName: string;
  formation: string;
  totalSales: number;
  highestSalesLocation: string;
  lowestSalesLocation: string;
  highestSalesMonth: string;
  lowestSalesMonth: string;
}