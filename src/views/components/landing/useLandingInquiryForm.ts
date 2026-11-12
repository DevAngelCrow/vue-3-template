import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useForm, type PublicPathState } from 'vee-validate';
import * as yup from 'yup';

import type { LandingInquiryDraft } from '@/core/store/useLandingInquiryStore';
import { FormatDate } from '@/core/utils/dates';

dayjs.extend(customParseFormat);

export interface LandingInquiryFormValues {
  firstName: string;
  lastName: string;
  companyName: string;
  idCountry: string;
  phone: string;
  email: string;
  idGeographicDivision: string;
  topic: string;
  targetDate: string | Date | null;
  notes: string;
  acceptTerms: boolean;
}

export type LandingInquiryFieldName = keyof LandingInquiryFormValues;

export interface LandingInquiryValidationSummary {
  valid: boolean;
  errors: Partial<Record<LandingInquiryFieldName, string>>;
  firstErrorField?: LandingInquiryFieldName;
  firstErrorMessage?: string;
  onlyTermsError: boolean;
}

export interface UseLandingInquiryFormOptions {
  draft: Ref<LandingInquiryDraft>;
  acceptTerms: Ref<boolean>;
  activeCountryIso2: ComputedRef<string | undefined>;
  activeCountryMask: ComputedRef<string | null>;
  hasCountryOptions: ComputedRef<boolean>;
  hasDivisionOptions: ComputedRef<boolean>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_PATTERN = /^[+\d\s().-]+$/;

const FIELD_ORDER: LandingInquiryFieldName[] = [
  'firstName',
  'lastName',
  'companyName',
  'idCountry',
  'phone',
  'email',
  'idGeographicDivision',
  'topic',
  'targetDate',
  'notes',
  'acceptTerms',
];

const getTomorrowStart = (): Date => {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

const normalizeDateValue = (
  value: string | Date | null | undefined,
): string => {
  if (!value) return '';
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? ''
      : (FormatDate(value, 'DD/MM/YYYY') ?? '');
  }
  return value;
};

const trimString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

export function useLandingInquiryForm({
  draft,
  acceptTerms,
  activeCountryIso2,
  activeCountryMask,
  hasCountryOptions,
  hasDivisionOptions,
}: UseLandingInquiryFormOptions) {
  const minTargetDate = ref<Date>(getTomorrowStart());

  const refreshMinTargetDate = () => {
    minTargetDate.value = getTomorrowStart();
  };

  const buildValuesFromStore = (): LandingInquiryFormValues => ({
    firstName: draft.value.firstName ?? '',
    lastName: draft.value.lastName ?? '',
    companyName: draft.value.companyName ?? '',
    idCountry: draft.value.idCountry ?? '',
    phone: draft.value.phone ?? '',
    email: draft.value.email ?? '',
    idGeographicDivision: draft.value.idGeographicDivision ?? '',
    topic: draft.value.topic ?? '',
    targetDate: normalizeDateValue(draft.value.targetDate),
    notes: draft.value.notes ?? '',
    acceptTerms: Boolean(acceptTerms.value),
  });

  const validationSchema: yup.ObjectSchema<LandingInquiryFormValues> =
    yup.object({
      firstName: yup
        .string()
        .default('')
        .transform(trimString)
        .required('El nombre es obligatorio.')
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(60, 'El nombre no puede exceder 60 caracteres.'),
      lastName: yup
        .string()
        .default('')
        .transform(trimString)
        .required('Los apellidos son obligatorios.')
        .min(2, 'Los apellidos deben tener al menos 2 caracteres.')
        .max(60, 'Los apellidos no pueden exceder 60 caracteres.'),
      companyName: yup
        .string()
        .default('')
        .transform(trimString)
        .max(150, 'La empresa u organización no puede exceder 150 caracteres.'),
      idCountry: yup
        .string()
        .default('')
        .transform(trimString)
        .test('country-required-if-loaded', function (value) {
          if (hasCountryOptions.value && !value) {
            return this.createError({
              message: 'Selecciona un país de contacto.',
            });
          }
          return true;
        }),
      phone: yup
        .string()
        .default('')
        .transform(trimString)
        .test('phone-valid', function (value) {
          const digits = (value || '').replace(/\D/g, '');
          if (!value || digits.length === 0) {
            return this.createError({
              message: 'El teléfono es obligatorio.',
            });
          }
          if (value.length > 20) {
            return this.createError({
              message: 'El teléfono no puede exceder 20 caracteres.',
            });
          }

          const iso2 = activeCountryIso2.value?.toUpperCase();
          const mask = activeCountryMask.value;

          if (value.includes('_')) {
            return this.createError({
              message: 'Completa el número telefónico según el formato.',
            });
          }

          if (iso2 === 'US' && digits.length !== 10) {
            return this.createError({
              message: 'El teléfono de EE. UU. debe tener 10 dígitos.',
            });
          }

          if (mask) {
            const expectedMaskDigits = (mask.match(/9/g) || []).length;
            const minDigits = Math.max(8, expectedMaskDigits);
            if (digits.length < minDigits) {
              return this.createError({
                message: `El teléfono debe tener al menos ${minDigits} dígitos.`,
              });
            }
            return true;
          }

          if (!PHONE_CHARS_PATTERN.test(value)) {
            return this.createError({
              message:
                'El teléfono solo puede contener números y símbolos (+, -, paréntesis).',
            });
          }
          if (digits.length < 8) {
            return this.createError({
              message: 'El teléfono debe tener al menos 8 dígitos.',
            });
          }
          return true;
        }),
      email: yup
        .string()
        .default('')
        .transform(trimString)
        .required('El correo electrónico es obligatorio.')
        .max(150, 'El correo electrónico no puede exceder 150 caracteres.')
        .test('email-valid', function (value) {
          if (!value) return true;
          if (!EMAIL_PATTERN.test(value)) {
            return this.createError({
              message: 'Ingresa un correo electrónico válido.',
            });
          }
          return true;
        }),
      idGeographicDivision: yup
        .string()
        .default('')
        .transform(trimString)
        .test('division-required-if-loaded', function (value) {
          if (hasDivisionOptions.value && !value) {
            return this.createError({
              message: 'Selecciona un departamento, estado o división.',
            });
          }
          return true;
        }),
      topic: yup
        .string()
        .default('')
        .transform(trimString)
        .max(100, 'El tema de consulta no puede exceder 100 caracteres.'),
      targetDate: yup
        .mixed<string | Date>()
        .nullable()
        .defined()
        .default('')
        .test('target-date-valid', function (value) {
          if (value === null || value === undefined) return true;
          if (typeof value === 'string' && value.trim() === '') return true;

          let candidateDay: Date | null = null;
          if (value instanceof Date) {
            if (Number.isNaN(value.getTime())) {
              return this.createError({ message: 'Ingresa una fecha válida.' });
            }
            candidateDay = new Date(
              value.getFullYear(),
              value.getMonth(),
              value.getDate(),
            );
          } else if (typeof value === 'string') {
            const trimmed = value.trim();
            const parsedSlash = dayjs(trimmed, 'DD/MM/YYYY', true);
            const parsedIso = !parsedSlash.isValid()
              ? dayjs(trimmed, 'YYYY-MM-DD', true)
              : null;
            const parsed = parsedSlash.isValid() ? parsedSlash : parsedIso;
            if (!parsed || !parsed.isValid()) {
              return this.createError({
                message: 'Ingresa una fecha válida con formato DD/MM/AAAA.',
              });
            }
            candidateDay = new Date(
              parsed.year(),
              parsed.month(),
              parsed.date(),
            );
          } else {
            return this.createError({ message: 'Ingresa una fecha válida.' });
          }

          const tomorrow = getTomorrowStart();
          if (candidateDay.getTime() < tomorrow.getTime()) {
            return this.createError({
              message: 'La fecha tentativa debe ser posterior a hoy.',
            });
          }
          return true;
        }),
      notes: yup
        .string()
        .default('')
        .transform(trimString)
        .max(1000, 'Las notas no pueden exceder 1000 caracteres.'),
      acceptTerms: yup
        .boolean()
        .default(false)
        .oneOf(
          [true],
          'Debes aceptar los términos y la política de privacidad para continuar.',
        )
        .required(
          'Debes aceptar los términos y la política de privacidad para continuar.',
        ),
    });

  const {
    errors,
    defineField,
    validate,
    validateField,
    setFieldValue,
    resetForm,
    resetField,
    setTouched,
  } = useForm<LandingInquiryFormValues>({
    validationSchema,
    initialValues: buildValuesFromStore(),
  });

  const textFieldConfig = (state: PublicPathState<string>) => ({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnModelUpdate: state.validated || state.errors.length > 0,
  });

  const selectFieldConfig = (state: PublicPathState<string>) => ({
    validateOnBlur: false,
    validateOnChange: true,
    validateOnModelUpdate: state.validated || state.errors.length > 0,
  });

  const dateFieldConfig = () => ({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnModelUpdate: true,
  });

  const checkboxFieldConfig = () => ({
    validateOnBlur: false,
    validateOnChange: true,
    validateOnModelUpdate: true,
  });

  const [firstName, firstNameAttrs] = defineField('firstName', textFieldConfig);
  const [lastName, lastNameAttrs] = defineField('lastName', textFieldConfig);
  const [companyName, companyNameAttrs] = defineField(
    'companyName',
    textFieldConfig,
  );
  const [idCountry, idCountryAttrs] = defineField(
    'idCountry',
    selectFieldConfig,
  );
  const [phone, phoneAttrs] = defineField('phone', textFieldConfig);
  const [email, emailAttrs] = defineField('email', textFieldConfig);
  const [idGeographicDivision, idGeographicDivisionAttrs] = defineField(
    'idGeographicDivision',
    selectFieldConfig,
  );
  const [topic, topicAttrs] = defineField('topic', selectFieldConfig);
  const [targetDate, targetDateAttrs] = defineField(
    'targetDate',
    dateFieldConfig,
  );
  const [notes, notesAttrs] = defineField('notes', textFieldConfig);
  const [acceptTermsField, acceptTermsAttrs] = defineField(
    'acceptTerms',
    checkboxFieldConfig,
  );

  // Sincronización unidireccional hacia Pinia con guard de igualdad (evita bucles infinitos)
  const syncStringFieldToStore = (
    fieldRef: Ref<string>,
    key: Exclude<
      keyof LandingInquiryDraft,
      'targetDate' | 'requiresOnboarding'
    >,
  ) => {
    watch(fieldRef, nextVal => {
      const normalized = nextVal ?? '';
      if (draft.value[key] !== normalized) {
        draft.value[key] = normalized;
      }
    });
  };

  syncStringFieldToStore(firstName, 'firstName');
  syncStringFieldToStore(lastName, 'lastName');
  syncStringFieldToStore(companyName, 'companyName');
  syncStringFieldToStore(idCountry, 'idCountry');
  syncStringFieldToStore(phone, 'phone');
  syncStringFieldToStore(email, 'email');
  syncStringFieldToStore(idGeographicDivision, 'idGeographicDivision');
  syncStringFieldToStore(topic, 'topic');
  syncStringFieldToStore(notes, 'notes');

  watch(targetDate, nextVal => {
    const normalizedNext = normalizeDateValue(nextVal);
    const normalizedStore = normalizeDateValue(draft.value.targetDate);
    if (normalizedStore !== normalizedNext) {
      draft.value.targetDate = normalizedNext;
    }
  });

  watch(acceptTermsField, nextVal => {
    const boolVal = Boolean(nextVal);
    if (acceptTerms.value !== boolVal) {
      acceptTerms.value = boolVal;
    }
  });

  // Sincronización desde Pinia cuando otra sección actualiza el borrador
  watch(
    () => draft.value.idCountry,
    nextVal => {
      const normalized = nextVal ?? '';
      if (idCountry.value !== normalized) {
        setFieldValue('idCountry', normalized, false);
      }
    },
  );

  watch(
    () => draft.value.idGeographicDivision,
    nextVal => {
      const normalized = nextVal ?? '';
      if (idGeographicDivision.value !== normalized) {
        setFieldValue('idGeographicDivision', normalized, false);
      }
    },
  );

  watch(
    () => draft.value.topic,
    nextVal => {
      const normalized = nextVal ?? '';
      if (topic.value !== normalized) {
        setFieldValue('topic', normalized, false);
      }
    },
  );

  watch(acceptTerms, nextVal => {
    const boolVal = Boolean(nextVal);
    if (Boolean(acceptTermsField.value) !== boolVal) {
      setFieldValue('acceptTerms', boolVal, false);
    }
  });

  watch(idCountry, (nextCountry, prevCountry) => {
    if (!prevCountry || nextCountry === prevCountry) return;

    if (draft.value.idGeographicDivision !== '') {
      draft.value.idGeographicDivision = '';
    }
    resetField('idGeographicDivision', {
      value: '',
      touched: false,
      errors: [],
    });

    if (phone.value?.trim() || errors.value.phone) {
      void validateField('phone');
    }
  });

  watch(hasDivisionOptions, () => {
    if (errors.value.idGeographicDivision) {
      void validateField('idGeographicDivision');
    }
  });

  const onSelectHide = (
    fieldName: 'idCountry' | 'idGeographicDivision' | 'topic',
  ) => {
    void validateField(fieldName);
  };

  const mergedPhoneAttrs = computed(() => ({
    ...phoneAttrs.value,
    onBlur: () => {
      const digits = String(phone.value || '').replace(/\D/g, '');
      if (digits.length === 0 && phone.value) {
        phone.value = '';
      }
      phoneAttrs.value.onBlur();
    },
  }));

  const validateBeforeSubmit =
    async (): Promise<LandingInquiryValidationSummary> => {
      refreshMinTargetDate();
      const result = await validate({ mode: 'force' });
      setTouched(true);

      const orderedErrors: Partial<Record<LandingInquiryFieldName, string>> =
        {};
      const errorKeys: LandingInquiryFieldName[] = [];

      for (const key of FIELD_ORDER) {
        const msg = result.errors[key];
        if (typeof msg === 'string' && msg.length > 0) {
          orderedErrors[key] = msg;
          errorKeys.push(key);
        }
      }

      const firstErrorField = errorKeys[0];
      const firstErrorMessage = firstErrorField
        ? orderedErrors[firstErrorField]
        : undefined;
      const onlyTermsError =
        errorKeys.length === 1 && firstErrorField === 'acceptTerms';

      return {
        valid: result.valid,
        errors: orderedErrors,
        firstErrorField,
        firstErrorMessage,
        onlyTermsError,
      };
    };

  const resetFormValidation = () => {
    refreshMinTargetDate();
    resetForm({
      values: buildValuesFromStore(),
      errors: {},
    });
    setTouched(false);
  };

  return {
    errors,
    minTargetDate,
    firstName,
    firstNameAttrs,
    lastName,
    lastNameAttrs,
    companyName,
    companyNameAttrs,
    idCountry,
    idCountryAttrs,
    phone,
    phoneAttrs: mergedPhoneAttrs,
    email,
    emailAttrs,
    idGeographicDivision,
    idGeographicDivisionAttrs,
    topic,
    topicAttrs,
    targetDate,
    targetDateAttrs,
    notes,
    notesAttrs,
    acceptTermsField,
    acceptTermsAttrs,
    onSelectHide,
    validateBeforeSubmit,
    resetFormValidation,
  };
}
