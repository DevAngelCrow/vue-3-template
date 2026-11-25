import { defineStore } from 'pinia';

import { FormatDateToISO } from '@/core/utils/dates';

export interface LandingCapabilitySelection {
  id: string;
  code: string;
  name: string;
  category: string;
}

export interface LandingInquiryDraft {
  firstName: string;
  lastName: string;
  companyName: string;
  idCountry: string;
  phone: string;
  email: string;
  idGeographicDivision: string;
  topic: string;
  targetDate: string | Date | null;
  requiresOnboarding: boolean;
  notes: string;
}

const createDefaultDraft = (idCountry = ''): LandingInquiryDraft => ({
  firstName: '',
  lastName: '',
  companyName: '',
  idCountry,
  phone: '',
  email: '',
  idGeographicDivision: '',
  topic: 'Arquitectura Fullstack',
  targetDate: '',
  requiresOnboarding: true,
  notes: '',
});

interface LandingInquiryState {
  selectedModules: LandingCapabilitySelection[];
  activeCategoryFilter: string;
  draft: LandingInquiryDraft;
  acceptTerms: boolean;
  lastReferenceCode: string;
  lastSubmittedSignature: string;
}

export const useLandingInquiryStore = defineStore('landingInquiryStore', {
  state: (): LandingInquiryState => ({
    selectedModules: [],
    activeCategoryFilter: 'ALL',
    draft: createDefaultDraft(),
    acceptTerms: false,
    lastReferenceCode: '',
    lastSubmittedSignature: '',
  }),
  getters: {
    selectedCount: state => state.selectedModules.length,
  },
  actions: {
    isSelected(moduleId: string): boolean {
      return this.selectedModules.some(item => item.id === moduleId);
    },
    toggleModule(moduleItem: LandingCapabilitySelection) {
      const existingIndex = this.selectedModules.findIndex(
        item => item.id === moduleItem.id,
      );
      if (existingIndex >= 0) {
        this.selectedModules.splice(existingIndex, 1);
      } else {
        this.selectedModules.push(moduleItem);
      }
    },
    removeModule(moduleId: string) {
      this.selectedModules = this.selectedModules.filter(
        item => item.id !== moduleId,
      );
    },
    clearModules() {
      this.selectedModules = [];
    },
    buildPayloadSignature(): string {
      const normalizedDate =
        FormatDateToISO(this.draft.targetDate) ||
        String(this.draft.targetDate || '').trim();

      return JSON.stringify({
        modules: this.selectedModules.map(item => item.id),
        firstName: this.draft.firstName.trim(),
        lastName: this.draft.lastName.trim(),
        companyName: this.draft.companyName.trim(),
        idCountry: this.draft.idCountry,
        phone: this.draft.phone.trim(),
        email: this.draft.email.trim().toLowerCase(),
        idGeographicDivision: this.draft.idGeographicDivision,
        topic: this.draft.topic.trim(),
        targetDate: normalizedDate,
        requiresOnboarding: this.draft.requiresOnboarding,
        notes: this.draft.notes.trim(),
        acceptTerms: this.acceptTerms,
      });
    },
    markSubmitted(referenceCode: string, signature: string) {
      this.lastReferenceCode = referenceCode;
      this.lastSubmittedSignature = signature;
    },
    resetDraft() {
      const currentCountry = this.draft.idCountry;
      this.selectedModules = [];
      this.draft = createDefaultDraft(currentCountry);
      this.acceptTerms = false;
      this.lastReferenceCode = '';
      this.lastSubmittedSignature = '';
    },
  },
});
