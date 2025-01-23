import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  private tabType: string = 'tabType';
  private tokenKey: string = 'authToken';

  constructor() {}
  setTabItem(tabType: string) {
    localStorage.setItem(this.tabType, JSON.stringify(tabType));
  }
  getTabItem() {
    const data: any = localStorage.getItem(this.tabType);
    return JSON.parse(data) || '';
  }
  setAuthToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  removeTabItem() {
    localStorage.removeItem(this.tabType);
  }
}
