import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appValidateField]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidateFieldDirective,
      multi: true,
    },
  ],
})
export class ValidateFieldDirective implements Validator {
  // Regular expressions for email and username
  private emailRegex: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private usernameRegex: RegExp = /^[a-zA-Z0-9_]{3,20}$/;

  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const isValidEmail = this.emailRegex.test(value);
    const isValidUsername = this.usernameRegex.test(value);

    if (!isValidEmail && !isValidUsername) {
      return { validateField: 'The value must be a valid email or username.' };
    }
    return null;
  }
}
