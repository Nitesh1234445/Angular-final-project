import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordStrength = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = String(control.value || '');
    // at least 8 chars, 1 letter, 1 number
    const ok = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]{8,}$/.test(v);
    return ok ? null : { weakPassword: true };
  };
};
