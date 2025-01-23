import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import { DrugReportResponse } from '../../models/top-brands.model';
import {MapComponent} from "../map/map.component";

@Component({
  selector: 'app-brand-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-details.component.html',
  styleUrl: './brand-details.component.css',
})
export class BrandDetailsComponent {
  @Input() brandDetailData!: DrugReportResponse;
  @Output() backEvent = new EventEmitter<void>();


  goBack() {
    this.backEvent.emit();
  }
}
