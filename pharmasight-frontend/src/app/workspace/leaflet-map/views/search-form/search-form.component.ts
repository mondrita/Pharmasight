import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MapService } from '../../../../service/map.service';
import {GenericData} from "../../models/search.models";

interface GenericSuggestion {
  id: number;
  genericName: string;
}

interface VendorSuggestion {
  id: number;
  vendorName: string;
}

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class SearchFormComponent implements OnInit {
  @Output() search = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() closeModalEmitter = new EventEmitter<void>();
  @Output() searchParamEmitter = new EventEmitter<any>();
  @Output() genericNameChange = new EventEmitter<string>();
  @Input() genericData: GenericData | null = null;

  @Output() genericDataChange = new EventEmitter<GenericData>();
  public searchForm!: FormGroup;
  public searchParameter = {
    genericId: 1,
    vendorId: 1,
    startDate: '',
    endDate: '',
  };
  public genericName = '';
  public suggestions: GenericSuggestion[] = [];
  public vendorSuggestions: VendorSuggestion[] = [];
  showSuggestion: boolean = false;
  showVendorSuggestion: boolean = false;

  constructor(
      private formBuilder: FormBuilder,
      private mapService: MapService
  ) {}

  ngOnInit() {
    this.initializeSearchForm();

    this.searchForm.get('genericId')?.valueChanges.subscribe((input) => {
      if (input && input.length > 0) {
        this.getSuggestions(input);
      } else {
        this.suggestions = [];
        this.showSuggestion = false;
      }
    });
    this.searchForm.get('vendorId')?.valueChanges.subscribe((input) => {
      if (input && input.length > 0) {
        this.getVendorSuggestions(input);
      } else {
        this.vendorSuggestions = [];
        this.showVendorSuggestion = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['genericData'] && changes['genericData'].currentValue) {
      this.genericName = this.genericData?.genericName || '';
      this.searchForm.patchValue({
        genericId: this.genericData?.genericName || '',
        startDate: this.genericData?.startDate || '',
        endDate: this.genericData?.endDate || '',
      });
    }
  }

  initializeSearchForm() {
    this.searchForm = this.formBuilder.group({
      genericId: ['Paracetamol', Validators.required],
      vendorId: ['Square Pharmaceuticals Ltd.', Validators.required],
      startDate: ['2024-01-01', Validators.required],
      endDate: ['2024-12-30', Validators.required],
    });
  }

  getSuggestions(query: string) {
    this.mapService
        .getGenericSuggestions(query)
        .subscribe((response: GenericSuggestion[]) => {
          console.log('generic', response);
          this.suggestions = response;
          this.showSuggestion = true;
        });
  }

  getVendorSuggestions(query: string) {
    this.mapService
        .getVendorSuggestions(query)
        .subscribe((response: VendorSuggestion[]) => {
          this.vendorSuggestions = response;
          this.showVendorSuggestion = true;
        });
  }

  selectSuggestion(suggestion: GenericSuggestion) {
    this.searchForm.get('genericId')?.setValue(suggestion.genericName);
    this.searchParameter = {
      ...this.searchParameter,
      genericId: suggestion.id,
    };
    this.genericName = suggestion.genericName;
    this.suggestions = [];
    this.showSuggestion = false;
  }

  selectVendorSuggestion(suggestion: VendorSuggestion) {
    this.searchForm.get('vendorId')?.setValue(suggestion.vendorName);
    this.searchParameter = {
      ...this.searchParameter,
      vendorId: suggestion.id,
    };
    this.vendorSuggestions = [];
    this.showVendorSuggestion = false;
  }

  onBlur(type: 'generic' | 'vendor') {
    setTimeout(() => {
      if (type === 'generic') {
        this.showSuggestion = false;
      } else {
        this.showVendorSuggestion = false;
      }
    }, 200);
  }

  searchHandler() {
    const formGenericId = this.searchForm.get('genericId')?.value;
    if (this.searchForm.valid) {
      this.searchParameter = {
        ...this.searchParameter,
        startDate: this.searchForm.value.startDate,
        endDate: this.searchForm.value.endDate,
      };
      const genericData: GenericData = {
        genericName: formGenericId,
        startDate: this.searchForm.value.startDate,
        endDate: this.searchForm.value.endDate,
      };
      this.searchParamEmitter.emit(this.searchParameter);
      this.genericDataChange.emit(genericData);
    }
  }

  closeModal(): void {
    this.closeModalEmitter.emit();
  }
}
