import { ServiceItem } from '../../types.ts';

export const corporateServices: ServiceItem[] = [
  {
    id: 'buchhaltung_laufend',
    title: 'Laufende Buchführung & Belegorganisation',
    category: 'accounting',
    categoryLabel: 'Buchhaltung',
    shortDesc: 'Laufende Buchführung im Rahmen der gesetzlich zulässigen Tätigkeiten, Erfassung und Ordnung von Geschäftsvorgängen.',
    fullDesc: 'Als Buchhalter unterstütze ich Selbstständige, Freiberufler und Unternehmen bei der laufenden kaufmännischen Organisation und bei vorbereitenden Buchhaltungsarbeiten. Mein Ziel ist es, Sie zuverlässig bei Ihren administrativen Aufgaben zu entlasten.',
    durationMinutes: 60,
    durationLabel: '60 Minuten',
    iconName: 'Calculator',
    popular: true,
    bulletPoints: [
      'Laufende Buchführung im Rahmen der gesetzlich zulässigen Tätigkeiten (§ 6 Nr. 3 & 4 StBerG)',
      'Erfassung und Ordnung von Geschäftsvorgängen',
      'Unterstützung bei der Vorbereitung der Buchhaltungsunterlagen',
      'Kontierung und Zuordnung von Belegen',
      'Vorbereitung von Unterlagen für den Steuerberater'
    ],
    targetAudience: 'Selbstständige, Freiberufler & kleine bis mittelständische Unternehmen (KMU)'
  },
  {
    id: 'buero_service',
    title: 'Büroservice & Administrative Organisation',
    category: 'office',
    categoryLabel: 'Büroservice',
    shortDesc: 'Allgemeine Büroorganisation, digitale Belegverwaltung, Schriftverkehr und administrative Unterstützung.',
    fullDesc: 'Für eine strukturierte und ordentliche Organisation Ihrer laufenden Unterlagen. Wir übernehmen allgemeine Büroorganisation, Schriftverkehr und Belegablage zuverlässig und unkompliziert.',
    durationMinutes: 45,
    durationLabel: '45 Minuten',
    iconName: 'FileSpreadsheet',
    popular: true,
    bulletPoints: [
      'Allgemeine Büroorganisation',
      'Digitale und organisatorische Belegverwaltung',
      'Schriftverkehr und administrative Unterstützung',
      'Ablage und Ordnung von Geschäftsunterlagen',
      'Unterstützung bei laufenden Verwaltungsaufgaben'
    ],
    targetAudience: 'Unternehmen, Freiberufler und Selbstständige aller Branchen'
  },
  {
    id: 'kaufmaennische_organisation',
    title: 'Laufende kaufmännische Betreuung',
    category: 'consulting',
    categoryLabel: 'Organisation',
    shortDesc: 'Persönliche, zuverlässige und unkomplizierte Zusammenarbeit für Selbstständige und KMU mit festem Ansprechpartner.',
    fullDesc: 'Ich unterstütze insbesondere kleine und mittelständische Unternehmen sowie Selbstständige, die ihre laufenden kaufmännischen und organisatorischen Aufgaben professionell erledigen lassen möchten.',
    durationMinutes: 60,
    durationLabel: '60 Minuten',
    iconName: 'Briefcase',
    popular: false,
    bulletPoints: [
      'Fester persönlicher Ansprechpartner (Dr. Abdul Sattar)',
      'Unterstützung bei der laufenden kaufmännischen Organisation',
      'Direkte Kommunikation und unkomplizierte Abläufe',
      'Zuverlässige Entlastung bei administrativen Routineaufgaben',
      'Persönlich vor Ort in Leipzig oder digital per Video-Call'
    ],
    targetAudience: 'KMU, Gewerbetreibende & Freiberufler'
  },
  {
    id: 'steuerberater_vorbereitung',
    title: 'Vorbereitung von Unterlagen für den Steuerberater',
    category: 'tax',
    categoryLabel: 'Vorbereitung',
    shortDesc: 'Strukturierte und lückenlose Vorbereitung aller Unterlagen zur Abstimmung mit dem Steuerberater des Kunden.',
    fullDesc: 'Keine Steuerberatung: Wir bieten keine steuerrechtliche Beratung an. Auf Wunsch werden die für die steuerliche Bearbeitung erforderlichen Unterlagen strukturiert und vorbereitet und mit dem zuständigen Steuerberater abgestimmt.',
    durationMinutes: 45,
    durationLabel: '45 Minuten',
    iconName: 'FileText',
    popular: false,
    bulletPoints: [
      'Strukturierte Vorbereitung aller erforderlichen Buchhaltungsunterlagen',
      'Lückenlose Kontierung und Belegzuordnung',
      'Organisatorische Abstimmung mit dem Steuerberater des Mandanten',
      'Wichtiger Hinweis: Keine eigene Steuerberatung gemäß StBerG'
    ],
    targetAudience: 'Mandanten mit externem Steuerberater zur Reduktion von Kanzleikosten'
  }
];
