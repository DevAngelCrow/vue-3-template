export interface LandingCapabilityItem {
  id: string;
  code: string;
  name: string;
  category: 'Seguridad & IAM' | 'UI PrimeVue 5' | 'Datos & Storage';
  icon: string;
  summary: string;
  highlights: string[];
  stackTag: string;
}

export interface LandingLegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  tone?: 'default' | 'warn';
  callout?: {
    title?: string;
    body: string;
  };
}

export interface LandingLegalDocument {
  version: string;
  publishedAt: string;
  summaryBadge: string;
  subtitle: string;
  sections: LandingLegalSection[];
}

export interface LandingTopicOption {
  id: string;
  name: string;
}

export const LANDING_TOPIC_OPTIONS: LandingTopicOption[] = [
  { id: 'fullstack', name: 'Arquitectura Fullstack' },
  { id: 'b2b-saas', name: 'SaaS B2B Multi-módulo' },
  { id: 'erp-inventory', name: 'ERP & Gestión Operativa' },
  { id: 'customer-portal', name: 'Portal Público + Backoffice' },
  { id: 'audit-compliance', name: 'Auditoría & Seguridad IAM' },
  { id: 'document-storage', name: 'Gestor Documental S3 / PDF' },
];

export const scrollToLandingSection = (targetId: string): void => {
  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export const LANDING_CAPABILITIES: LandingCapabilityItem[] = [
  {
    id: 'cap-iam-n-levels',
    code: 'IAM-TREE',
    name: 'Menú Recursivo N-Niveles & RBAC',
    category: 'Seguridad & IAM',
    icon: 'pi pi-sitemap',
    summary:
      'Filtrado jerárquico en backend, poda de contenedores vacíos, caché Redis versionada O(1) y router fail-closed.',
    highlights: ['Sin límite de profundidad', 'Soft-delete estricto'],
    stackTag: 'NestJS + Redis + Vue Router',
  },
  {
    id: 'cap-turnstile-http',
    code: 'SEC-BOT',
    name: 'Protección Anti-Bot & Proxy Trust',
    category: 'Seguridad & IAM',
    icon: 'pi pi-shield',
    summary:
      'TurnstileService en backend con composable useTurnstile on-demand, TRUST_PROXY configurable e IP real.',
    highlights: ['Validación siteverify', 'Cleanup automático'],
    stackTag: 'Cloudflare Turnstile + Express',
  },
  {
    id: 'cap-primevue5-ui',
    code: 'UI-PV5',
    name: 'Wrappers PrimeVue 5 + Skeletons',
    category: 'UI PrimeVue 5',
    icon: 'pi pi-palette',
    summary:
      'Componentes App* tipados con ARIA, AppTab animado (tailwindcss-primeui), Command Menu Ctrl+K y tokens semánticos.',
    highlights: ['Motion-reduce nativo', 'Cero type assertions'],
    stackTag: 'PrimeVue ^5.0.4 + Tailwind 4',
  },
  {
    id: 'cap-forms-vee-pinia',
    code: 'FORM-SYNC',
    name: 'Formularios Vee-Validate + Pinia',
    category: 'UI PrimeVue 5',
    icon: 'pi pi-check-square',
    summary:
      'Sincronización bidireccional sin bucles infinitos, máscara telefónica dinámica por país y scroll al primer error.',
    highlights: ['FIELD_ORDER determinista', 'AppInputMask ARIA'],
    stackTag: 'Vee-Validate + Yup + Pinia',
  },
  {
    id: 'cap-storage-s3-pdf',
    code: 'STO-S3',
    name: 'Storage Binario Local / S3 & PDF',
    category: 'Datos & Storage',
    icon: 'pi pi-cloud-upload',
    summary:
      'Lectura en buffer desde S3 o disco local, validación de magic bytes %PDF y cabeceras Content-Disposition UTF-8.',
    highlights: ['Stream seguro', 'Rutas hasta 500 chars'],
    stackTag: 'AWS SDK S3 + Multer',
  },
  {
    id: 'cap-tx-sequences',
    code: 'DB-SEQ',
    name: 'Transacciones AfterCommit & Folios',
    category: 'Datos & Storage',
    icon: 'pi pi-database',
    summary:
      'Puerto AfterCommitPort para efectos irreversibles tras commit exitoso y SequenceGeneratorService atómico.',
    highlights: ['Cero race conditions', 'Reinicio anual automático'],
    stackTag: 'Prisma 7 + PostgreSQL',
  },
];

export const LANDING_DEMO_PRIVACY_DOC: LandingLegalDocument = {
  version: '1.0',
  publishedAt: '2026-11-12',
  summaryBadge: 'Documento Modelo · Plantilla Base',
  subtitle:
    'Ejemplo estructural de Política de Privacidad reutilizable con AppModal, AppTab animado y AppSkeleton.',
  sections: [
    {
      heading: '1. Recolección de Datos del Formulario Público',
      paragraphs: [
        'Este modal demuestra el patrón de presentación documental desacoplado sobre PrimeVue 5. Puedes conectar estos paneles a un endpoint público con TanStack Query o renderizar políticas estáticas versionadas.',
      ],
      bullets: [
        'Soporta estados de carga con AppSkeleton y reintento en caso de error.',
        'Incluye soporte para secciones de advertencia destacadas mediante tokens warn-*.',
      ],
    },
    {
      heading: '2. Protección Anti-Bot y Seguridad HTTP',
      paragraphs: [
        'Cuando habilitas VITE_CLOUDFLARE_TURNSTILE_SITE_KEY en el cliente y CLOUDFLARE_TURNSTILE_SECRET_KEY en el servidor, el envío queda protegido contra envíos automatizados.',
      ],
      tone: 'warn',
      callout: {
        title: 'Nota de implementación',
        body: 'Sustituye este contenido de muestra por el texto legal oficial o consulta dinámica de tu aplicación.',
      },
    },
  ],
};

export const LANDING_DEMO_TERMS_DOC: LandingLegalDocument = {
  version: '1.0',
  publishedAt: '2026-11-12',
  summaryBadge: 'Términos Modelo · Uso General',
  subtitle:
    'Base de Términos y Condiciones con transición AppTab y tipografía accesible.',
  sections: [
    {
      heading: '1. Alcance de la Solicitud desde la Landing',
      paragraphs: [
        'El formulario de ejemplo valida los campos requeridos con Vee-Validate + Yup, adapta el formato telefónico según el catálogo dinámico de países y sincroniza el borrador en Pinia.',
      ],
    },
    {
      heading: '2. Buenas Prácticas de Consentimiento',
      paragraphs: [
        'Mantén el consentimiento explícito mediante checkbox vinculado al esquema de validación antes de habilitar cualquier envío hacia tu backend.',
      ],
      bullets: [
        'Validación obligatoria de aceptación antes de enviar.',
        'Desplazamiento automático hacia el primer campo inválido.',
      ],
    },
  ],
};
