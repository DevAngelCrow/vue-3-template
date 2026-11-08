import type { PrimeVueFile } from '@/types/PrimeVueFile';

import type { StepperVerticalInterface } from './stepperVertical.interface';

export interface BaseFormFieldProps {
  id?: string;
  label?: string;
  placeholder?: string;
  class?: string;
  errorMessage?: string;
  labelVariant?: 'on' | 'in' | 'over';
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'large';
  fluid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

export interface IconFormFieldProps extends BaseFormFieldProps {
  prependIcon?: string;
  appendIcon?: string;
}

export interface AppInputTextProps extends IconFormFieldProps {
  modelValue?: string | null;
  type?: string;
  autocomplete?: string;
}

export interface AppInputNumberProps extends BaseFormFieldProps {
  modelValue?: number | null;
  prependIcon?: string;
  autocomplete?: string;
  showButtons?: boolean;
  buttonLayout?: 'stacked' | 'horizontal' | 'vertical';
  min?: number;
  max?: number;
}

export interface AppInputMoneyProps extends BaseFormFieldProps {
  modelValue?: number | null;
  prependIcon?: string;
  autocomplete?: string;
  currency?: string;
  locale?: string;
  showButtons?: boolean;
  buttonLayout?: 'stacked' | 'horizontal' | 'vertical';
  min?: number;
  max?: number;
}

export interface AppInputMaskProps extends IconFormFieldProps {
  modelValue?: string | null;
  mask?: string;
  autocomplete?: string;
}

export interface AppInputTextAreaProps extends BaseFormFieldProps {
  modelValue?: string | null;
  autoResize?: boolean;
  autocomplete?: string;
}

export interface AppSelectProps extends BaseFormFieldProps {
  modelValue?: unknown;
  options?: unknown[];
  optionLabel?: string;
  optionValue?: string;
  showClear?: boolean;
  filter?: boolean;
}

export interface AppMultiSelectProps extends BaseFormFieldProps {
  modelValue?: unknown[] | null;
  options?: unknown[];
  optionLabel?: string;
  optionValue?: string;
  showClear?: boolean;
  filter?: boolean;
}

export interface AppAutocompleteProps extends IconFormFieldProps {
  modelValue?: unknown;
  suggestions?: unknown[];
  optionLabel?: string;
  multiple?: boolean;
  dropdown?: boolean;
  autocomplete?: string;
}

export interface AppDatePickerProps extends BaseFormFieldProps {
  selectionMode?: 'single' | 'multiple' | 'range';
  showOtherMonths?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDays?: number[];
  showTime?: boolean;
  icon?: string;
  iconDisplay?: 'button' | 'input';
}

export interface AppTimePickerProps extends BaseFormFieldProps {
  icon?: string;
  iconDisplay?: 'button' | 'input';
}

export interface AppColorPickerProps extends BaseFormFieldProps {
  modelValue?: string | null;
  format?: 'hex' | 'rgb' | 'hsb';
  inline?: boolean;
  showInputText?: boolean;
  mask?: string;
  autocomplete?: string;
}

export interface AppCheckBoxProps {
  modelValue?: boolean | unknown[];
  id?: string;
  label?: string;
  class?: string;
  binary?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  errorMessage?: string;
}

export interface AppSelectButtonProps {
  modelValue?: unknown;
  class?: string;
  options?: unknown[];
  optionLabel?: string;
  optionValue?: string;
  optionDisabled?: string;
  multiple?: boolean;
  size?: 'small' | 'large';
  invalid?: boolean;
  disabled?: boolean;
  fluid?: boolean;
  allowEmpty?: boolean;
}

export interface AppDragDropFileProps {
  modelValue?: PrimeVueFile[];
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxDimensions?: string;
  showFormats?: boolean;
  showMaxSize?: boolean;
  errorMessage?: string;
}

export interface AppModalProps {
  show?: boolean;
  title?: string;
  width?: string;
  showFooter?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  showCloseIcon?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
}

export interface AppDocumentVisorProps {
  documentName?: string;
  file?: string;
  show?: boolean;
  validType?: string;
  width?: string;
}

export interface AppPaginatorProps {
  rows?: number;
  totalRecords?: number;
  total_records?: number;
  first?: number;
  rowsPerPageOptions?: number[];
  showPerPageOptions?: boolean;
}

export interface AppChipStatusProps {
  label?: string;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface AppFloatButtonProps {
  imageSrc?: string;
  alt?: string;
  icon?: string;
  class?: string;
}

export interface AppVerticalStepperProps {
  steps?: number;
  components: StepperVerticalInterface[];
  linear?: boolean;
}

export interface AppTitleProps {
  title: string;
}
