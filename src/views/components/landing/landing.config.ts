export interface LandingContactInfo {
  businessName: string;
  tagline: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappDisplay: string;
  whatsappNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  coverageArea: string;
  scheduleWeekdays: string;
  scheduleWeekend: string;
  instagramHandle: string;
  instagramUrl: string;
  facebookName: string;
  facebookUrl: string;
}

/**
 * Configuración centralizada de datos de contacto y negocio para la Landing.
 * Edita estos valores para personalizar los datos de tu empresa o aplicación.
 */
export const LANDING_CONTACT_INFO: LandingContactInfo = {
  businessName: 'Vue 3 Enterprise',
  tagline: 'Plantilla Frontend Profesional de Alto Rendimiento',
  phoneDisplay: '+503 2222-0000',
  phoneRaw: '50322220000',
  whatsappDisplay: '+503 7000-0000',
  whatsappNumber: '50370000000',
  email: 'contacto@ejemplo.com',
  addressLine1: 'Edificio Corporativo Central, Nivel 4',
  addressLine2: 'San Salvador, El Salvador',
  coverageArea: 'Servicios en toda la región metropolitana',
  scheduleWeekdays: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
  scheduleWeekend: 'Sábados: 9:00 AM - 1:00 PM',
  instagramHandle: '@vue3enterprise',
  instagramUrl: 'https://instagram.com',
  facebookName: 'Vue 3 Enterprise Template',
  facebookUrl: 'https://facebook.com',
};
