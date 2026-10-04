export type Language = 'de' | 'en' | 'ur';

export interface TranslationDictionary {
  // Navigation & Header
  nav_home: string;
  nav_services: string;
  nav_why_us: string;
  nav_advisors: string;
  nav_contact: string;
  nav_book_btn: string;
  nav_staff_login: string;
  nav_tagline: string;
  nav_accreditation: string;
  nav_open_slots: string;

  // Landing Page Hero
  hero_badge: string;
  hero_heading_pre: string;
  hero_heading_highlight: string;
  hero_heading_post: string;
  hero_subheading: string;
  hero_book_btn: string;
  hero_services_btn: string;
  hero_stat1_val: string;
  hero_stat1_label: string;
  hero_stat1_sub: string;
  hero_stat2_val: string;
  hero_stat2_label: string;
  hero_stat2_sub: string;
  hero_stat3_val: string;
  hero_stat3_label: string;
  hero_stat3_sub: string;
  hero_stat4_val: string;
  hero_stat4_label: string;
  hero_stat4_sub: string;

  // Legal Notice / Disclaimer (Keine Steuerberatung)
  legal_notice_badge: string;
  legal_notice_title: string;
  legal_notice_text: string;
  legal_notice_subtext: string;

  // Services Section
  services_badge: string;
  services_title: string;
  services_subtitle: string;
  services_filter_all: string;
  services_filter_tax: string;
  services_filter_audit: string;
  services_filter_consulting: string;
  services_filter_finance: string;
  services_filter_accounting: string;
  services_card_min: string;
  services_card_target: string;
  services_card_book: string;
  services_card_popular: string;

  // Why Us / Value Pillars
  why_us_badge: string;
  why_us_title: string;
  why_us_subtitle: string;
  pillar1_title: string;
  pillar1_desc: string;
  pillar2_title: string;
  pillar2_desc: string;
  pillar3_title: string;
  pillar3_desc: string;
  pillar4_title: string;
  pillar4_desc: string;

  // Advisors Spotlight
  advisors_badge: string;
  advisors_title: string;
  advisors_subtitle: string;
  advisors_book_with: string;

  // Testimonials
  testimonials_badge: string;
  testimonials_title: string;
  testimonials_subtitle: string;

  // FAQ
  faq_badge: string;
  faq_title: string;
  faq_subtitle: string;

  // Booking Flow Steps
  booking_flow_badge: string;
  booking_flow_title: string;
  step1_title: string;
  step1_sub: string;
  step2_title: string;
  step2_sub: string;
  step3_title: string;
  step3_sub: string;
  step4_title: string;
  step4_sub: string;
  step1_choose_service: string;
  step1_service_scope: string;
  step1_next_btn: string;
  step2_choose_date: string;
  step2_choose_advisor: string;
  step2_any_advisor: string;
  step2_slots_available: string;
  step2_no_slots: string;
  step2_next_btn: string;
  step2_prev_btn: string;
  step3_client_title: string;
  step3_full_name: string;
  step3_email: string;
  step3_phone: string;
  step3_company: string;
  step3_address: string;
  step3_task_reason: string;
  step3_notes: string;
  step3_gdpr_agree: string;
  step3_submit_btn: string;
  step3_prev_btn: string;
  step4_confirmed_title: string;
  step4_confirmed_desc: string;
  step4_ref_label: string;
  step4_download_ics: string;
  step4_print: string;
  step4_home_btn: string;

  // Footer
  footer_about_title: string;
  footer_about_desc: string;
  footer_links_title: string;
  footer_services_title: string;
  footer_contact_title: string;
  footer_rights: string;
  footer_imprint: string;
  footer_privacy: string;
  footer_terms: string;

  // Admin Workspace
  overview: string;
  appointments: string;
  clients: string;
  settings: string;
  help: string;
  signout: string;
  new_appointment: string;
  portal_title: string;
  search_placeholder: string;
  super_admin: string;
  advisor: string;

  // Dashboard Stats
  stats_clients: string;
  stats_active_clients: string;
  stats_booked: string;
  stats_total: string;
  stats_confirmed: string;
  stats_secured: string;
  stats_cancelled: string;
  stats_losses: string;
  next_appointments: string;
  today_and_upcoming: string;
  no_upcoming_apts: string;

  // Client Directory
  client_directory: string;
  client_subtitle: string;
  add_client: string;
  table_name: string;
  table_email: string;
  table_phone: string;
  table_since: string;
  table_actions: string;
  view_appointments: string;
  no_clients_found: string;

  // Settings
  settings_account_profile: string;
  settings_name: string;
  settings_email: string;
  settings_role: string;
  settings_admin: string;
  settings_db_interface: string;
  settings_db_connected: string;
  settings_db_host: string;
  settings_db_status: string;
  settings_db_engine: string;

  // Help
  help_center: string;
  help_welcome: string;
  help_q1: string;
  help_a1: string;
  help_q2: string;
  help_a2: string;
  help_q3: string;
  help_a3: string;

  // Appointment Details Sidebar
  details_title: string;
  details_client_since: string;
  details_no_phone: string;
  details_service: string;
  details_date: string;
  details_time: string;
  details_status: string;
  details_notes: string;
  details_no_notes: string;
  details_documents: string;
  details_doc_placeholder: string;
  details_attach: string;
  details_confirm: string;
  details_reschedule: string;
  details_cancel: string;

  // Calendar
  cal_week: string;
  cal_month: string;
  cal_today: string;

  // Modal
  modal_create_action: string;
  modal_tab_book: string;
  modal_tab_create: string;
  modal_client_label: string;
  modal_client_select: string;
  modal_client_help: string;
  modal_service_label: string;
  modal_date_label: string;
  modal_start_label: string;
  modal_end_label: string;
  modal_advisor_label: string;
  modal_advisor_none: string;
  modal_notes_label: string;
  modal_notes_placeholder: string;
  modal_btn_book: string;
  modal_btn_booking: string;
  modal_btn_client: string;
  modal_btn_clienting: string;
  modal_client_name_label: string;
  modal_client_name_placeholder: string;
  modal_client_email_label: string;
  modal_client_phone_label: string;
  modal_client_since_label: string;
  modal_client_error: string;
  modal_client_success: string;

  // Status Values
  status_bestaetigt: string;
  status_ausstehend: string;
  status_verschoben: string;
  status_storniert: string;

  // Customer Dashboard - Navigation & Shell
  dash_nav_cockpit: string;
  dash_nav_appointments: string;
  dash_nav_analytics: string;
  dash_nav_chat: string;
  dash_nav_profile: string;
  dash_nav_book: string;
  dash_nav_website: string;
  dash_nav_logout: string;
  dash_client_badge: string;
  dash_status_online: string;

  // Customer Dashboard - Header
  dash_portal_badge: string;
  dash_welcome: string;
  dash_search_placeholder: string;
  dash_book_cta: string;
  dash_profile_cta: string;
  dash_client_id: string;
  dash_phone_unverified: string;

  // Customer Dashboard - Overview Tab
  dash_overview_banner_title: string;
  dash_overview_banner_desc: string;
  dash_kpi_total: string;
  dash_kpi_active: string;
  dash_kpi_upcoming: string;
  dash_kpi_hours: string;
  dash_kpi_hours_unit: string;
  dash_next_spotlight_title: string;
  dash_none_upcoming: string;
  dash_advisor_card_title: string;
  dash_advisor_desc: string;
  dash_chat_now: string;
  dash_recent_activity: string;
  dash_all_appointments_btn: string;

  // Customer Dashboard - Appointments Tab
  dash_apts_title: string;
  dash_apts_subtitle: string;
  dash_filter_all: string;
  dash_filter_confirmed: string;
  dash_filter_pending: string;
  dash_filter_rescheduled: string;
  dash_filter_completed: string;
  dash_filter_cancelled: string;
  dash_apts_search: string;
  dash_download_ics: string;
  dash_reschedule_action: string;
  dash_cancel_action: string;
  dash_no_matching_apts: string;
  dash_cancel_confirm_title: string;
  dash_cancel_confirm_desc: string;
  dash_cancel_keep: string;
  dash_cancel_proceed: string;

  // Customer Dashboard - Analytics Tab
  dash_analytics_title: string;
  dash_analytics_subtitle: string;
  dash_analytics_status_dist: string;
  dash_analytics_timeline: string;
  dash_analytics_practice: string;
  dash_analytics_compliance: string;
  dash_analytics_compliance_desc: string;

  // Customer Dashboard - Profile Tab
  dash_profile_title: string;
  dash_profile_subtitle: string;
  dash_profile_personal: string;
  dash_profile_firstname: string;
  dash_profile_lastname: string;
  dash_profile_email: string;
  dash_profile_phone: string;
  dash_profile_company_title: string;
  dash_profile_company_name: string;
  dash_profile_client_since: string;
  dash_profile_mandate_scope: string;
  dash_profile_save: string;
  dash_profile_saving: string;
  dash_profile_saved: string;
  dash_profile_security_box: string;
  dash_profile_sec_p1: string;
  dash_profile_sec_p2: string;
  dash_profile_sec_p3: string;

  // Customer Dashboard - Chat & Records Tab
  dash_chat_title: string;
  dash_chat_subtitle: string;
  dash_chat_general_ticket: string;
  dash_chat_appointment_ticket: string;
  dash_chat_placeholder: string;
  dash_chat_send: string;
  dash_chat_upload: string;
  dash_chat_gallery: string;
  dash_chat_no_files: string;
  dash_chat_you: string;
  dash_chat_advisor_label: string;
  dash_chat_priority: string;

  // Universal Banners & Top Navigation
  dash_logged_in_as: string;
  dash_back_to_cockpit: string;
  dash_login_register: string;
  dash_booking_status: string;

  // Landing Page & Universal CTA
  landing_free_initial_check: string;
  landing_professional_secrecy: string;
  landing_founder_badge: string;
  landing_request_appointment: string;
  landing_cta_heading: string;
  landing_cta_desc: string;
  landing_founder_journey_btn: string;

  // Founder Achievements Page
  founder_page_badge: string;
  founder_page_title: string;
  founder_page_subtitle: string;
  founder_page_journey_title: string;
  founder_page_journey_desc: string;
  founder_page_disciplines_title: string;
  founder_page_disciplines_subtitle: string;
  founder_page_book_title: string;
  founder_page_book_desc: string;
  founder_page_back_home: string;

  // Booking Steps & Calendar
  booking_allowed_range: string;
  booking_available_badge: string;
  booking_next_month_badge: string;
  booking_prev_month: string;
  booking_next_month: string;
  booking_legend_selected: string;
  booking_legend_available: string;
  booking_legend_locked: string;
  booking_client_logged_in_notice: string;
  booking_client_guest_notice: string;
  booking_confirmed_badge: string;
  booking_ticket_header: string;
  booking_location_label: string;
  booking_location_val: string;
  booking_contacts_label: string;
  booking_book_another: string;

  // Auth Modal & OTP
  auth_modal_badge: string;
  auth_welcome_title: string;
  auth_login_subtitle: string;
  auth_register_subtitle: string;
  auth_modal_login_tab: string;
  auth_modal_register_tab: string;
  auth_email_label: string;
  auth_password_label: string;
  auth_firstname_label: string;
  auth_lastname_label: string;
  auth_phone_label: string;
  auth_address_label: string;
  auth_company_label: string;
  auth_login_btn: string;
  auth_no_account: string;
  auth_register_now: string;
  auth_or: string;
  auth_quick_access: string;
  auth_email_exists_title: string;
  auth_email_exists_desc: string;
  auth_login_now: string;
  auth_request_otp_btn: string;
  auth_otp_required_title: string;
  auth_otp_required_desc: string;
  auth_sandbox_title: string;
  auth_sandbox_desc: string;
  auth_sandbox_btn: string;
  auth_confirm_register_btn: string;
  auth_back_to_form: string;
  auth_resend_code: string;
  auth_resend_wait: string;

  // Signout Confirmation Modal
  signout_confirm_title: string;
  signout_confirm_desc: string;
  signout_cancel: string;
  signout_proceed: string;

  // Footer
  footer_founder_profile: string;
  footer_founder_link: string;
  footer_office_hours_title: string;
  footer_office_hours_val: string;
  footer_cert_title: string;
  footer_cert_desc: string;
  footer_cert_badge: string;
  footer_headquarters: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  de: {
    nav_home: 'Startseite',
    nav_services: 'Leistungen & Expertise',
    nav_why_us: 'Warum A u.S',
    nav_advisors: 'Unsere Berater',
    nav_contact: 'Kontakt & Anfahrt',
    nav_book_btn: 'Termin buchen',
    nav_staff_login: 'Mitarbeiter-Login',
    nav_tagline: 'Buchhaltung & Büroservice in Leipzig',
    nav_accreditation: 'Persönlich • Zuverlässig • Strukturiert',
    nav_open_slots: '● Freie Beratungstermine verfügbar',

    hero_badge: 'A u. S Wirtschaftsberatung e.K. • Leipzig',
    hero_heading_pre: 'Professionelle Dienstleistungen für',
    hero_heading_highlight: 'Buchhaltung & Büroservice',
    hero_heading_post: 'in Leipzig.',
    hero_subheading: 'Als Buchhalter unterstütze ich Selbstständige, Freiberufler und Unternehmen bei der laufenden kaufmännischen Organisation und bei vorbereitenden Buchhaltungsarbeiten. Mein Ziel ist es, Unternehmen zuverlässig bei ihren administrativen Aufgaben zu entlasten und für eine strukturierte und ordentliche Organisation der laufenden Buchhaltungsunterlagen zu sorgen.',
    hero_book_btn: 'Gesprächstermin anfragen',
    hero_services_btn: 'Leistungen entdecken',
    hero_stat1_val: 'Leipzig',
    hero_stat1_label: 'Kanzleisitz',
    hero_stat1_sub: 'Lagerhofstraße 2, 04103 Leipzig',
    hero_stat2_val: '1:1',
    hero_stat2_label: 'Persönliche Betreuung',
    hero_stat2_sub: 'Fester Ansprechpartner Dr. Abdul Sattar',
    hero_stat3_val: 'e.K.',
    hero_stat3_label: 'Eingetragener Kaufmann',
    hero_stat3_sub: 'Amtsgericht Leipzig • HRA 18879',
    hero_stat4_val: '100%',
    hero_stat4_label: 'Zuverlässig & Strukturiert',
    hero_stat4_sub: 'Entlastung im kaufmännischen Alltag',

    // Legal Notice / Disclaimer
    legal_notice_badge: 'Gesetzlicher Hinweis (§ 6 StBerG)',
    legal_notice_title: 'Wichtiger Hinweis: Keine Steuerberatung',
    legal_notice_text: 'Die A u. S Wirtschaftsberatung e.K. ist kein Steuerberatungsunternehmen und bietet keine Steuerberatung an. Steuerrechtliche Beratung und Tätigkeiten, die ausschließlich Steuerberatern vorbehalten sind, werden nicht angeboten.',
    legal_notice_subtext: 'Auf Wunsch können die für die steuerliche Bearbeitung erforderlichen Unterlagen strukturiert und vorbereitet und mit dem zuständigen Steuerberater des Kunden abgestimmt werden.',

    services_badge: 'Unsere Leistungen',
    services_title: 'Buchhaltung & Büroservice in Leipzig',
    services_subtitle: 'Laufende Buchführung im Rahmen der gesetzlich zulässigen Tätigkeiten, Büroservice und administrative Organisation.',
    services_filter_all: 'Alle Leistungen',
    services_filter_tax: 'Steuerberater-Vorbereitung',
    services_filter_audit: 'Belegverwaltung',
    services_filter_consulting: 'Kaufmännische Betreuung',
    services_filter_finance: 'Büroorganisation',
    services_filter_accounting: 'Laufende Buchführung',
    services_card_min: 'Dauer ca.',
    services_card_target: 'Zielgruppe',
    services_card_book: 'Jetzt Termin anfragen',
    services_card_popular: 'Besonders gefragt',

    why_us_badge: 'Ihre Vorteile',
    why_us_title: 'Warum Unternehmen auf A u.S vertrauen',
    why_us_subtitle: 'Persönlich. Zuverlässig. Strukturiert. A u. S Wirtschaftsberatung e.K. steht für zuverlässige Unterstützung bei Buchhaltung und Büroorganisation.',
    pillar1_title: 'Persönliche Betreuung & Fester Ansprechpartner',
    pillar1_desc: 'Durch die persönliche Betreuung und direkte Kommunikation mit Dr. Abdul Sattar erhalten Kunden einen festen Ansprechpartner für ihre laufenden Aufgaben.',
    pillar2_title: 'Zuverlässige kaufmännische Entlastung',
    pillar2_desc: 'Mein Ziel ist es, Unternehmen zuverlässig bei ihren administrativen Aufgaben zu entlasten und für ordentliche Unterlagen zu sorgen.',
    pillar3_title: 'Digitale & organisatorische Belegverwaltung',
    pillar3_desc: 'Laufende Buchführung im Rahmen der gesetzlich zulässigen Tätigkeiten und professionelle digitale Belegorganisation.',
    pillar4_title: 'Reibungslose Vorbereitung für den Steuerberater',
    pillar4_desc: 'Auf Wunsch strukturieren und bereiten wir alle erforderlichen Unterlagen vor und stimmen sie direkt mit Ihrem Steuerberater ab.',

    advisors_badge: 'Über den Inhaber',
    advisors_title: 'Ihr Buchhalter in Leipzig: Dr. Abdul Sattar',
    advisors_subtitle: 'Dr. Abdul Sattar ist Inhaber der A u. S Wirtschaftsberatung e.K. und als Buchhalter im Bereich Buchhaltung und Büroservice tätig.',
    advisors_book_with: 'Termin mit Dr. Abdul Sattar anfragen',

    testimonials_badge: 'Mandantenstimmen',
    testimonials_title: 'Erfolgsgeschichten unserer Partner',
    testimonials_subtitle: 'Erfahren Sie, wie wir Unternehmen bei komplexen Prüfungen und Sanierungen begleitet haben.',

    faq_badge: 'Häufig gestellte Fragen',
    faq_title: 'Wissenswertes zu Ihrem Beratungstermin',
    faq_subtitle: 'Alles Wichtige rund um Ablauf, Vorbereitung und Modalitäten Ihres Termins.',

    booking_flow_badge: 'Verbindliche Online-Terminbuchung',
    booking_flow_title: 'In 4 Schritten zu Ihrem Wunschtermin',
    step1_title: '1. Leistung wählen',
    step1_sub: 'Fachgebiet & Anliegen',
    step2_title: '2. Datum & Uhrzeit',
    step2_sub: 'Verfügbare Zeitslots',
    step3_title: '3. Ihre Daten',
    step3_sub: 'Kontaktdaten & Unternehmen',
    step4_title: '4. Bestätigung',
    step4_sub: 'Terminübersicht & Kalender',
    step1_choose_service: 'Wählen Sie das gewünschte Beratungsthema aus:',
    step1_service_scope: 'Leistungsumfang & Beratungsfokus',
    step1_next_btn: 'Weiter zu Datum & Uhrzeit',
    step2_choose_date: 'Wählen Sie Ihren Wunschtermin:',
    step2_choose_advisor: 'Bevorzugter Berater',
    step2_any_advisor: 'Beliebiger qualifizierter Berater (Schnellster Termin)',
    step2_slots_available: 'Freie Zeitslots am ausgewählten Tag',
    step2_no_slots: 'An diesem Tag sind leider keine freien Slots verfügbar. Bitte wählen Sie ein anderes Datum.',
    step2_next_btn: 'Weiter zu Ihren Angaben',
    step2_prev_btn: 'Zurück zur Leistungsauswahl',
    step3_client_title: 'Ihre Kontaktdaten für den Termin',
    step3_full_name: 'Vollständiger Name *',
    step3_email: 'E-Mail-Adresse *',
    step3_phone: 'Telefonnummer',
    step3_company: 'Unternehmen / Organisation',
    step3_address: 'Wohnanschrift / Firmensitz',
    step3_task_reason: 'Aufgabe / Anliegen des Termins',
    step3_notes: 'Besondere Anliegen oder Vorab-Informationen',
    step3_gdpr_agree: 'Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.',
    step3_submit_btn: 'Termin verbindlich anfragen',
    step3_prev_btn: 'Zurück zu Datum & Zeit',
    step4_confirmed_title: 'Ihr Termin wurde erfolgreich gebucht!',
    step4_confirmed_desc: 'Wir haben Ihnen eine Bestätigung per E-Mail gesendet. Unser Berater freut sich auf das Gespräch.',
    step4_ref_label: 'Buchungsreferenz',
    step4_download_ics: 'Kalenderdatei (.ics) herunterladen',
    step4_print: 'Bestätigung drucken',
    step4_home_btn: 'Zurück zur Startseite',

    footer_about_title: 'Über A u. S Wirtschaftsberatung e.K.',
    footer_about_desc: 'Ihr Buchhalter in Leipzig – persönliche Betreuung, strukturierte Buchhaltung und professioneller Büroservice.',
    footer_links_title: 'Schnellzugriff',
    footer_services_title: 'Fachbereiche',
    footer_contact_title: 'Kontakt & Standort',
    footer_rights: 'A u. S Wirtschaftsberatung e.K. Alle Rechte vorbehalten.',
    footer_imprint: 'Impressum',
    footer_privacy: 'Datenschutz',
    footer_terms: 'AGB',

    // Admin
    overview: 'Übersicht',
    appointments: 'Termine',
    clients: 'Mandanten',
    settings: 'Einstellungen',
    help: 'Hilfe',
    signout: 'Abmelden',
    new_appointment: 'Neuer Termin',
    portal_title: 'A u.S Portal',
    search_placeholder: 'Suchen...',
    super_admin: 'Super Admin',
    advisor: 'Berater',

    // Dashboard Stats
    stats_clients: 'Mandanten',
    stats_active_clients: 'Aktiv im System',
    stats_booked: 'Gebuchte Termine',
    stats_total: 'Insgesamt gebucht',
    stats_confirmed: 'Bestätigt',
    stats_secured: 'Gesichert & Bestätigt',
    stats_cancelled: 'Storniert',
    stats_losses: 'Ausfälle',
    next_appointments: 'Nächste anstehende Termine',
    today_and_upcoming: 'Heute & Kommend',
    no_upcoming_apts: 'Keine anstehenden Termine gefunden.',

    // Client Directory
    client_directory: 'Mandantenverzeichnis',
    client_subtitle: 'Verwalten Sie hier alle hinterlegten Klienten und rufen Sie historische Partnerschaftsdaten ab.',
    add_client: 'Mandant hinzufügen',
    table_name: 'Name / OHG',
    table_email: 'E-Mail Adresse',
    table_phone: 'Telefonnummer',
    table_since: 'Mandant Seit',
    table_actions: 'Aktionen',
    view_appointments: 'Termine anzeigen',
    no_clients_found: 'Keine Mandanten gefunden.',

    // Settings
    settings_account_profile: 'Konto-Profil',
    settings_name: 'Name',
    settings_email: 'E-Mail Adresse',
    settings_role: 'Berechtigungsrolle',
    settings_admin: 'System-Administrator',
    settings_db_interface: 'Datenbankschnittstelle',
    settings_db_connected: 'Die Anwendung ist sicher an eine relationale Cloud SQL (PostgreSQL) Instanz angebunden.',
    settings_db_host: 'Host: secure-cloud-sql-proxy',
    settings_db_status: 'Status: Aktiv ● Online',
    settings_db_engine: 'Engine: PostgreSQL 15.x',

    // Help
    help_center: 'Hilfecenter',
    help_welcome: 'Willkommen im Hilfecenter der A u. S Wirtschaftsberatung. Hier finden Sie Unterstützung zur Terminverwaltung:',
    help_q1: '1. Wie buche ich einen neuen Termin?',
    help_a1: 'Klicken Sie unten links in der Seitenleiste auf "Neuer Termin". Sie können dann den Mandanten, die Leistung, das Datum, die Zeiten und Notizen eingeben.',
    help_q2: '2. Wie erstelle ich einen neuen Mandanten?',
    help_a2: 'Öffnen Sie ebenfalls das "Neuer Termin" Fenster, wechseln Sie auf die Registerkarte "Mandant anlegen", füllen Sie das Formular aus und klicken Sie auf "Mandant anlegen".',
    help_q3: '3. Wie lade ich Dokumente hoch?',
    help_a3: 'Wählen Sie einen Termin im Kalender aus. Auf der rechten Seite finden Sie den Bereich "Dokumente". Geben Sie einen Namen ein und klicken Sie auf "Anhängen".',

    // Appointment Details Sidebar
    details_title: 'Termin-Details',
    details_client_since: 'Mandant seit',
    details_no_phone: 'Keine Telefonnummer',
    details_service: 'Leistung',
    details_date: 'Datum',
    details_time: 'Uhrzeit',
    details_status: 'Status',
    details_notes: 'Notizen',
    details_no_notes: 'Keine Notizen hinterlegt.',
    details_documents: 'Dokumente',
    details_doc_placeholder: 'Dokumentenname...',
    details_attach: 'Anhängen',
    details_confirm: 'Bestätigen',
    details_reschedule: 'Verschieben',
    details_cancel: 'Stornieren',

    // Calendar
    cal_week: 'Woche',
    cal_month: 'Monat',
    cal_today: 'Heute',

    // Modal
    modal_create_action: 'Vorgang Erstellen',
    modal_tab_book: 'Termin buchen',
    modal_tab_create: 'Mandant anlegen',
    modal_client_label: 'Mandant *',
    modal_client_select: '-- Mandant wählen --',
    modal_client_help: 'Mandant nicht gefunden? Wechseln Sie zum Reiter "Mandant anlegen".',
    modal_service_label: 'Leistung *',
    modal_date_label: 'Datum *',
    modal_start_label: 'Startzeit *',
    modal_end_label: 'Endzeit *',
    modal_advisor_label: 'Berater (Optional)',
    modal_advisor_none: '-- Nicht zugewiesen / Selbst --',
    modal_notes_label: 'Notizen',
    modal_notes_placeholder: 'Notizen zum Beratungsgespräch...',
    modal_btn_book: 'Termin anlegen',
    modal_btn_booking: 'Termin wird gebucht...',
    modal_btn_client: 'Mandant anlegen',
    modal_btn_clienting: 'Mandant wird angelegt...',
    modal_client_name_label: 'Name des Mandanten *',
    modal_client_name_placeholder: 'z.B. Müller & Co. OHG oder Petra Lehmann',
    modal_client_email_label: 'E-Mail Adresse *',
    modal_client_phone_label: 'Telefonnummer',
    modal_client_since_label: 'Mandant seit (Jahr)',
    modal_client_error: 'Name und E-Mail sind Pflichtfelder.',
    modal_client_success: 'wurde erfolgreich angelegt!',

    // Status Values
    status_bestaetigt: 'Bestätigt',
    status_ausstehend: 'Ausstehend',
    status_verschoben: 'Verschoben',
    status_storniert: 'Storniert',

    // Customer Dashboard - Navigation & Shell
    dash_nav_cockpit: 'Übersicht',
    dash_nav_appointments: 'Termine & Status',
    dash_nav_analytics: 'Analysen & Grafiken',
    dash_nav_chat: 'Chat & Akten',
    dash_nav_profile: 'Mein Profil',
    dash_nav_book: 'Neuer Termin',
    dash_nav_website: 'Zur Website',
    dash_nav_logout: 'Abmelden',
    dash_client_badge: 'Mandanten-Cockpit',
    dash_status_online: 'Online',

    // Customer Dashboard - Header
    dash_portal_badge: 'A u.S Mandanten-Portal',
    dash_welcome: 'Willkommen',
    dash_search_placeholder: 'Termine, Akten, Berater suchen...',
    dash_book_cta: 'Termin buchen',
    dash_profile_cta: 'Profil bearbeiten',
    dash_client_id: 'Mandanten-ID',
    dash_phone_unverified: 'Telefon nicht verifiziert',

    // Customer Dashboard - Overview Tab
    dash_overview_banner_title: 'Willkommen zurück',
    dash_overview_banner_desc: 'Ihr persönlicher Zugriff auf alle steuerlichen & betriebswirtschaftlichen Mandatsunterlagen der Kanzlei A u.S.',
    dash_kpi_total: 'Gesamttermine',
    dash_kpi_active: 'Bestätigt & Aktiv',
    dash_kpi_upcoming: 'Nächster Termin',
    dash_kpi_hours: 'Beratungsstunden',
    dash_kpi_hours_unit: 'Std.',
    dash_next_spotlight_title: 'Ihr nächster anstehender Termin',
    dash_none_upcoming: 'Keine bevorstehenden Termine',
    dash_advisor_card_title: 'Ihr Senior Betreuer',
    dash_advisor_desc: 'Zertifizierter Wirtschaftsprüfer & Steuerberater. Zuständig für strategische Gestaltungsberatung und Jahresabschlussprüfung.',
    dash_chat_now: 'Direkt im Chat kontaktieren',
    dash_recent_activity: 'Letzte Aktivitäten & Aktenstatus',
    dash_all_appointments_btn: 'Alle Termine anzeigen',

    // Customer Dashboard - Appointments Tab
    dash_apts_title: 'Mandantentermine & Aktenstatus',
    dash_apts_subtitle: 'Vollständige Historie aller gebuchten Beratungen, Statusänderungen und hinterlegten Kalenderdateien.',
    dash_filter_all: 'Alle',
    dash_filter_confirmed: 'Bestätigt',
    dash_filter_pending: 'In Bearbeitung',
    dash_filter_rescheduled: 'Verschoben',
    dash_filter_completed: 'Abgeschlossen',
    dash_filter_cancelled: 'Storniert',
    dash_apts_search: 'Termine nach Berater, Leistung oder Ort durchsuchen...',
    dash_download_ics: 'Kalender (.ics)',
    dash_reschedule_action: 'Verschieben anfragen',
    dash_cancel_action: 'Stornieren',
    dash_no_matching_apts: 'Keine Termine mit diesem Filter gefunden.',
    dash_cancel_confirm_title: 'Termin stornieren?',
    dash_cancel_confirm_desc: 'Möchten Sie diesen Termin wirklich stornieren? Unser Berater wird benachrichtigt.',
    dash_cancel_keep: 'Abbrechen & Behalten',
    dash_cancel_proceed: 'Ja, Termin stornieren',

    // Customer Dashboard - Analytics Tab
    dash_analytics_title: 'Mandatsanalysen & Kennzahlen',
    dash_analytics_subtitle: 'Transparente Übersicht Ihrer Mandatsinteraktionen, Serviceverteilung und zeitlichen Entwicklung.',
    dash_analytics_status_dist: 'Statusverteilung der Termine',
    dash_analytics_timeline: 'Monatliche Terminverteilung (2024)',
    dash_analytics_practice: 'Verteilung nach Fachbereichen',
    dash_analytics_compliance: 'Compliance & Datenschutz',
    dash_analytics_compliance_desc: '100% DSGVO-konforme Datenhaltung auf ISO-zertifizierten deutschen Servern mit lückenlosem Audit-Trail.',

    // Customer Dashboard - Profile Tab
    dash_profile_title: 'Stammdaten & Mandantenprofil',
    dash_profile_subtitle: 'Hinterlegte Kontakt- und Unternehmensdaten für Ihre steuerliche und betriebswirtschaftliche Betreuung.',
    dash_profile_personal: 'Persönliche Angaben',
    dash_profile_firstname: 'Vorname',
    dash_profile_lastname: 'Nachname',
    dash_profile_email: 'E-Mail-Adresse',
    dash_profile_phone: 'Mobilnummer für SMS & Rückfragen',
    dash_profile_company_title: 'Unternehmensdaten',
    dash_profile_company_name: 'Firmenname / Kanzlei',
    dash_profile_client_since: 'Mandant seit',
    dash_profile_mandate_scope: 'Mandatsumfang',
    dash_profile_save: 'Änderungen speichern',
    dash_profile_saving: 'Speichern...',
    dash_profile_saved: 'Profil erfolgreich aktualisiert!',
    dash_profile_security_box: 'Datenschutz & Vertraulichkeit',
    dash_profile_sec_p1: 'Berufsrechtliche Verschwiegenheit gem. § 43 BRAO & § 57 StBerG',
    dash_profile_sec_p2: 'Ende-zu-Ende Verschlüsselung aller Mandantenübertragungen',
    dash_profile_sec_p3: 'Serverstandort Frankfurt am Main (ISO/IEC 27001)',

    // Customer Dashboard - Chat & Records Tab
    dash_chat_title: 'Mandanten-Chat & Aktenaustausch',
    dash_chat_subtitle: 'Sichere Kommunikation & Dokumentenaustausch mit der Kanzlei A u.S.',
    dash_chat_general_ticket: 'Allgemeines Ticket / Mandantenanfrage',
    dash_chat_appointment_ticket: 'Terminakte',
    dash_chat_placeholder: 'Nachricht oder Mitteilung eingeben...',
    dash_chat_send: 'Senden',
    dash_chat_upload: 'Datei hochladen',
    dash_chat_gallery: 'Akten & Dokumente',
    dash_chat_no_files: 'Bisher keine Dokumente hinterlegt.',
    dash_chat_you: 'Sie',
    dash_chat_advisor_label: 'Kanzlei / Berater',
    dash_chat_priority: 'Hohe Priorität / Eilfall',

    // Universal Banners & Top Navigation
    dash_logged_in_as: 'Angemeldet als',
    dash_back_to_cockpit: 'Zurück zum Cockpit',
    dash_login_register: 'Anmelden / Registrieren',
    dash_booking_status: 'Buchungsstatus',

    // Landing Page & Universal CTA
    landing_free_initial_check: 'Kostenfreie Erstprüfung',
    landing_professional_secrecy: 'Berufsgeheimnis nach StBerG & WPO',
    landing_founder_badge: 'Kanzleiinhaber & Berater',
    landing_request_appointment: 'Persönlichen Termin anfragen',
    landing_cta_heading: 'Bereit für ein strategisches Beratungsgespräch?',
    landing_cta_desc: 'Sichern Sie sich jetzt Ihren persönlichen Beratungstermin direkt mit Kanzleiinhaber Abdul Sattar.',
    landing_founder_journey_btn: 'Über den Gründer (Abdul Sattar)',

    // Founder Achievements Page
    founder_page_badge: 'Wissenschaftliches Profil & Werdegang',
    founder_page_title: 'Abdul Sattar',
    founder_page_subtitle: 'Kanzleiinhaber & Wirtschaftsberater',
    founder_page_journey_title: 'Akademischer Werdegang & Meilensteine',
    founder_page_journey_desc: 'Eine chronologische Übersicht der universitären Abschlüsse, Forschungsarbeiten und Ehrungen von Abdul Sattar.',
    founder_page_disciplines_title: 'Vier wissenschaftliche Säulen ganzheitlicher Beratung',
    founder_page_disciplines_subtitle: 'Interdisziplinäre Denkkultur',
    founder_page_book_title: 'Vereinbaren Sie Ihr persönliches Gespräch mit Abdul Sattar',
    founder_page_book_desc: 'Profitieren Sie von fundierter Expertise an der Schnittstelle von Wirtschaftsberatung, Informationsrecht und strategischer Unternehmensführung.',
    founder_page_back_home: 'Zurück zur Startseite',

    // Booking Steps & Calendar
    booking_allowed_range: 'Buchungszeitraum: Aktueller & kommender Monat (Mo–Do & Sa)',
    booking_available_badge: 'Verfügbar für Direktbuchung',
    booking_next_month_badge: 'Folgemonat',
    booking_prev_month: 'Vorheriger Monat',
    booking_next_month: 'Nächster Monat',
    booking_legend_selected: 'Ausgewählt',
    booking_legend_available: 'Freigeschaltet',
    booking_legend_locked: 'Gesperrt / Folgemonat',
    booking_client_logged_in_notice: 'Ihre Daten wurden aus Ihrem verifizierten Mandantenprofil übernommen.',
    booking_client_guest_notice: 'Buchen Sie schnell als Gast oder melden Sie sich für automatische Datenübernahme an.',
    booking_confirmed_badge: 'Termin verbindlich gebucht',
    booking_ticket_header: 'Terminübersicht & Kanzleidaten',
    booking_location_label: 'Ort / Durchführung:',
    booking_location_val: 'Lagerhofstraße 2, Leipzig / Online Video-Call',
    booking_contacts_label: 'Hinterlegte Kontaktdaten:',
    booking_book_another: '← Weiteren Termin anfragen',

    // Auth Modal & OTP
    auth_modal_badge: 'Mandanten-Authentifizierung',
    auth_welcome_title: 'Willkommen zurück',
    auth_login_subtitle: 'Melden Sie sich mit Ihrer E-Mail und Ihrem Passwort an.',
    auth_register_subtitle: 'Erstellen Sie Ihr Konto für 1-Klick-Buchungen & direkten Mandanten-Chat.',
    auth_modal_login_tab: 'Anmelden',
    auth_modal_register_tab: 'Registrieren',
    auth_email_label: 'E-Mail-Adresse *',
    auth_password_label: 'Passwort *',
    auth_firstname_label: 'Vorname *',
    auth_lastname_label: 'Nachname *',
    auth_phone_label: 'Telefonnummer (für SMS & Bestätigung) *',
    auth_address_label: 'Wohnanschrift / Firmensitz *',
    auth_company_label: 'Unternehmen / Organisation (optional)',
    auth_login_btn: 'Direkt Anmelden',
    auth_no_account: 'Noch kein Konto?',
    auth_register_now: 'Jetzt registrieren',
    auth_or: 'Oder',
    auth_quick_access: 'Mandanten-Schnellzugang',
    auth_email_exists_title: 'E-Mail bereits registriert!',
    auth_email_exists_desc: 'Diese E-Mail ist im Kanzlei-System hinterlegt.',
    auth_login_now: 'Jetzt anmelden →',
    auth_request_otp_btn: 'Bestätigungscode anfordern',
    auth_otp_required_title: 'E-Mail Bestätigung erforderlich',
    auth_otp_required_desc: 'Wir haben einen 6-stelligen Sicherheitscode an Ihre E-Mail gesendet.',
    auth_sandbox_title: 'Sandbox-Aktivierungscode (Sofortzugang):',
    auth_sandbox_desc: 'Da sich das E-Mail-System im Test-/Sandbox-Modus befindet, können Sie diesen Code direkt mit 1 Klick einfügen:',
    auth_sandbox_btn: 'Code automatisch eintragen',
    auth_confirm_register_btn: 'Konto bestätigen & Registrieren',
    auth_back_to_form: '← Angaben korrigieren',
    auth_resend_code: 'Code erneut senden',
    auth_resend_wait: 'Erneut senden in',

    // Signout Confirmation Modal
    signout_confirm_title: 'Möchten Sie sich wirklich abmelden?',
    signout_confirm_desc: 'Ihre aktuelle Sitzung wird beendet und alle lokalen Daten werden aus Ihrem Browser entfernt.',
    signout_cancel: 'Abbrechen',
    signout_proceed: 'Ja, jetzt abmelden',

    // Footer
    footer_founder_profile: 'Kanzleileitung & Profil',
    footer_founder_link: 'Werdegang Abdul Sattar',
    footer_office_hours_title: 'Sprechzeiten',
    footer_office_hours_val: 'Mo – Do: 09:00 – 18:00 Uhr | Sa: 09:00 – 18:00 Uhr',
    footer_cert_title: 'Zertifizierung & Datenschutz',
    footer_cert_desc: 'Höchste Sicherheitsstandards, DSGVO-konforme Mandantenverwaltung und verschlüsselte Dokumentenübertragung.',
    footer_cert_badge: 'Zertifizierte Kanzlei-Infrastruktur',
    footer_headquarters: 'Kanzleisitz:',
  },

  en: {
    nav_home: 'Home',
    nav_services: 'Services & Expertise',
    nav_why_us: 'Why A u.S',
    nav_advisors: 'Our Advisors',
    nav_contact: 'Contact & Directions',
    nav_book_btn: 'Book Appointment',
    nav_staff_login: 'Staff Login',
    nav_tagline: 'Bookkeeping & Office Service in Leipzig',
    nav_accreditation: 'Personal • Reliable • Structured',
    nav_open_slots: '● Open consultation slots available',

    hero_badge: 'A u. S Wirtschaftsberatung e.K. • Leipzig',
    hero_heading_pre: 'Professional Services for',
    hero_heading_highlight: 'Bookkeeping & Office Service',
    hero_heading_post: 'in Leipzig.',
    hero_subheading: 'As a professional bookkeeper, I support self-employed individuals, freelancers, and businesses with ongoing commercial organization and preparatory bookkeeping. My goal is to reliably relieve businesses of administrative burdens and ensure structured and orderly organization of records.',
    hero_book_btn: 'Request Consultation',
    hero_services_btn: 'Explore Services',
    hero_stat1_val: 'Leipzig',
    hero_stat1_label: 'Firm Location',
    hero_stat1_sub: 'Lagerhofstraße 2, 04103 Leipzig',
    hero_stat2_val: '1:1',
    hero_stat2_label: 'Personal Support',
    hero_stat2_sub: 'Dedicated Partner Dr. Abdul Sattar',
    hero_stat3_val: 'e.K.',
    hero_stat3_label: 'Registered Commercial Firm',
    hero_stat3_sub: 'Amtsgericht Leipzig • HRA 18879',
    hero_stat4_val: '100%',
    hero_stat4_label: 'Reliable & Structured',
    hero_stat4_sub: 'Commercial Peace of Mind',

    // Legal Notice / Disclaimer
    legal_notice_badge: 'Statutory Legal Notice',
    legal_notice_title: 'Important Notice: No Tax Consulting Services',
    legal_notice_text: 'A u. S Wirtschaftsberatung e.K. is not a tax consulting firm and does not provide legal tax advisory services. Legal advice and tasks reserved exclusively for certified tax advisors (Steuerberater) under German statutory law are not offered.',
    legal_notice_subtext: 'Upon request, records necessary for tax processing can be structured, prepared, and coordinated with the client’s appointed tax advisor.',

    services_badge: 'Our Services',
    services_title: 'Bookkeeping & Office Service in Leipzig',
    services_subtitle: 'Ongoing bookkeeping within statutory permitted limits, office organization, and commercial management support.',
    services_filter_all: 'All Services',
    services_filter_tax: 'Tax Advisor Preparation',
    services_filter_audit: 'Document Organization',
    services_filter_consulting: 'Commercial Support',
    services_filter_finance: 'Office Organization',
    services_filter_accounting: 'Ongoing Bookkeeping',
    services_card_min: 'Duration approx.',
    services_card_target: 'Target Audience',
    services_card_book: 'Book Appointment Now',
    services_card_popular: 'Most Requested',

    why_us_badge: 'Why Choose Us',
    why_us_title: 'Why Businesses Rely on A u.S',
    why_us_subtitle: 'Personal. Reliable. Structured. A u. S Wirtschaftsberatung e.K. provides dependable assistance for bookkeeping and office administration.',
    pillar1_title: 'Personal Support & Dedicated Contact',
    pillar1_desc: 'Through personal care and direct communication with Dr. Abdul Sattar, clients have a single trusted advisor for all ongoing tasks.',
    pillar2_title: 'Reliable Administrative Relief',
    pillar2_desc: 'We relieve self-employed professionals and companies of organizational burdens, keeping your documentation impeccably structured.',
    pillar3_title: 'Digital & Physical Document Management',
    pillar3_desc: 'Systematic sorting and digital filing of business receipts and records within statutory permitted boundaries.',
    pillar4_title: 'Seamless Preparation for Tax Accountants',
    pillar4_desc: 'We prepare and coordinate all required accounting records directly with your certified tax consultant upon request.',

    advisors_badge: 'About the Owner',
    advisors_title: 'Your Bookkeeper in Leipzig: Dr. Abdul Sattar',
    advisors_subtitle: 'Dr. Abdul Sattar is the proprietor of A u. S Wirtschaftsberatung e.K. and works as a bookkeeper in bookkeeping and office services.',
    advisors_book_with: 'Request appointment with Dr. Abdul Sattar',

    testimonials_badge: 'Client Testimonials',
    testimonials_title: 'Success Stories of Our Partners',
    testimonials_subtitle: 'Learn how we have guided companies through complex audits and restructuring.',

    faq_badge: 'Frequently Asked Questions',
    faq_title: 'Key Information About Your Consultation',
    faq_subtitle: 'Everything you need to know about preparation, procedure, and modalities.',

    booking_flow_badge: 'Online Appointment Booking',
    booking_flow_title: 'Book Your Consultation in 4 Steps',
    step1_title: '1. Select Service',
    step1_sub: 'Domain & Scope',
    step2_title: '2. Date & Time',
    step2_sub: 'Available Time Slots',
    step3_title: '3. Your Information',
    step3_sub: 'Contact & Company Data',
    step4_title: '4. Confirmation',
    step4_sub: 'Summary & Calendar',
    step1_choose_service: 'Select the desired consultation topic:',
    step1_service_scope: 'Service Scope & Focus Areas',
    step1_next_btn: 'Proceed to Date & Time',
    step2_choose_date: 'Select your preferred date:',
    step2_choose_advisor: 'Preferred Advisor',
    step2_any_advisor: 'Any Qualified Advisor (Earliest Available)',
    step2_slots_available: 'Available time slots on selected date',
    step2_no_slots: 'No open time slots available on this date. Please choose another date.',
    step2_next_btn: 'Proceed to Your Details',
    step2_prev_btn: 'Back to Services',
    step3_client_title: 'Your Contact Details for the Appointment',
    step3_full_name: 'Full Name *',
    step3_email: 'Email Address *',
    step3_phone: 'Phone Number',
    step3_company: 'Company / Organization (Optional)',
    step3_address: 'Postal Address / Headquarters',
    step3_task_reason: 'Task / Reason for Appointment',
    step3_notes: 'Your Inquiries & Background (Optional)',
    step3_gdpr_agree: 'I agree to data processing in accordance with the Privacy Policy.',
    step3_submit_btn: 'Confirm & Book Appointment',
    step3_prev_btn: 'Back to Date & Time',
    step4_confirmed_title: 'Your Appointment Has Been Successfully Booked!',
    step4_confirmed_desc: 'We have sent a confirmation email to your address. Our advisor looks forward to speaking with you.',
    step4_ref_label: 'Booking Reference',
    step4_download_ics: 'Download Calendar File (.ics)',
    step4_print: 'Print Confirmation',
    step4_home_btn: 'Return to Homepage',

    footer_about_title: 'About A u.S Advisory',
    footer_about_desc: 'Leading auditing and tax advisory firm based in Munich with DATEV digital excellence.',
    footer_links_title: 'Quick Links',
    footer_services_title: 'Practice Areas',
    footer_contact_title: 'Contact & Location',
    footer_rights: 'A u. S Wirtschaftsberatung e.K. All rights reserved.',
    footer_imprint: 'Imprint',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'T&C',

    // Admin
    overview: 'Overview',
    appointments: 'Appointments',
    clients: 'Clients',
    settings: 'Settings',
    help: 'Help',
    signout: 'Sign Out',
    new_appointment: 'New Appointment',
    portal_title: 'A u.S Portal',
    search_placeholder: 'Search...',
    super_admin: 'Super Admin',
    advisor: 'Advisor',

    // Dashboard Stats
    stats_clients: 'Clients',
    stats_active_clients: 'Active in System',
    stats_booked: 'Booked Appointments',
    stats_total: 'Total Booked',
    stats_confirmed: 'Confirmed',
    stats_secured: 'Secured & Confirmed',
    stats_cancelled: 'Cancelled',
    stats_losses: 'Cancellations',
    next_appointments: 'Next Upcoming Appointments',
    today_and_upcoming: 'Today & Upcoming',
    no_upcoming_apts: 'No upcoming appointments found.',

    // Client Directory
    client_directory: 'Client Directory',
    client_subtitle: 'Manage all registered clients and retrieve historical partnership data.',
    add_client: 'Add Client',
    table_name: 'Name / Company',
    table_email: 'Email Address',
    table_phone: 'Phone Number',
    table_since: 'Client Since',
    table_actions: 'Actions',
    view_appointments: 'View Appointments',
    no_clients_found: 'No clients found.',

    // Settings
    settings_account_profile: 'Account Profile',
    settings_name: 'Name',
    settings_email: 'Email Address',
    settings_role: 'Access Role',
    settings_admin: 'System Administrator',
    settings_db_interface: 'Database Interface',
    settings_db_connected: 'The application is securely connected to a relational Cloud SQL (PostgreSQL) instance.',
    settings_db_host: 'Host: secure-cloud-sql-proxy',
    settings_db_status: 'Status: Active ● Online',
    settings_db_engine: 'Engine: PostgreSQL 15.x',

    // Help
    help_center: 'Help Center',
    help_welcome: 'Welcome to the Help Center of A u.S Business Consulting. Here you will find support for appointment management:',
    help_q1: '1. How do I book a new appointment?',
    help_a1: 'Click on "New Appointment" in the bottom left of the sidebar. You can then enter the client, service, date, times, and notes.',
    help_q2: '2. How do I create a new client?',
    help_a2: 'Also open the "New Appointment" window, switch to the "Create Client" tab, fill out the form and click on "Create Client".',
    help_q3: '3. How do I upload documents?',
    help_a3: 'Select an appointment in the calendar. On the right side, you will find the "Documents" section. Enter a name and click "Attach".',

    // Appointment Details Sidebar
    details_title: 'Appointment Details',
    details_client_since: 'Client since',
    details_no_phone: 'No phone number',
    details_service: 'Service',
    details_date: 'Date',
    details_time: 'Time',
    details_status: 'Status',
    details_notes: 'Notes',
    details_no_notes: 'No notes provided.',
    details_documents: 'Documents',
    details_doc_placeholder: 'Document name...',
    details_attach: 'Attach',
    details_confirm: 'Confirm',
    details_reschedule: 'Reschedule',
    details_cancel: 'Cancel',

    // Calendar
    cal_week: 'Week',
    cal_month: 'Month',
    cal_today: 'Today',

    // Modal
    modal_create_action: 'Create Process',
    modal_tab_book: 'Book Appointment',
    modal_tab_create: 'Create Client',
    modal_client_label: 'Client *',
    modal_client_select: '-- Select Client --',
    modal_client_help: 'Client not found? Switch to "Create Client" tab.',
    modal_service_label: 'Service *',
    modal_date_label: 'Date *',
    modal_start_label: 'Start Time *',
    modal_end_label: 'End Time *',
    modal_advisor_label: 'Advisor (Optional)',
    modal_advisor_none: '-- Unassigned / Self --',
    modal_notes_label: 'Notes',
    modal_notes_placeholder: 'Notes on the consultation...',
    modal_btn_book: 'Create Appointment',
    modal_btn_booking: 'Booking appointment...',
    modal_btn_client: 'Create Client',
    modal_btn_clienting: 'Creating client...',
    modal_client_name_label: 'Client Name *',
    modal_client_name_placeholder: 'e.g. Acme Corp or John Doe',
    modal_client_email_label: 'Email Address *',
    modal_client_phone_label: 'Phone Number',
    modal_client_since_label: 'Client since (Year)',
    modal_client_error: 'Name and Email are required.',
    modal_client_success: 'successfully created!',

    // Status Values
    status_bestaetigt: 'Confirmed',
    status_ausstehend: 'Pending',
    status_verschoben: 'Rescheduled',
    status_storniert: 'Cancelled',

    // Customer Dashboard - Navigation & Shell
    dash_nav_cockpit: 'Overview',
    dash_nav_appointments: 'Appointments & Status',
    dash_nav_analytics: 'Analytics & Charts',
    dash_nav_chat: 'Chat & Records',
    dash_nav_profile: 'My Profile',
    dash_nav_book: 'New Appointment',
    dash_nav_website: 'To Website',
    dash_nav_logout: 'Sign Out',
    dash_client_badge: 'Client Cockpit',
    dash_status_online: 'Online',

    // Customer Dashboard - Header
    dash_portal_badge: 'A u.S Client Portal',
    dash_welcome: 'Welcome',
    dash_search_placeholder: 'Search appointments, records, advisors...',
    dash_book_cta: 'Book Appointment',
    dash_profile_cta: 'Edit Profile',
    dash_client_id: 'Client ID',
    dash_phone_unverified: 'Phone not verified',

    // Customer Dashboard - Overview Tab
    dash_overview_banner_title: 'Welcome back',
    dash_overview_banner_desc: 'Your direct access to all tax & corporate advisory documents from A u.S firm.',
    dash_kpi_total: 'Total Appointments',
    dash_kpi_active: 'Confirmed & Active',
    dash_kpi_upcoming: 'Next Appointment',
    dash_kpi_hours: 'Consultation Hours',
    dash_kpi_hours_unit: 'hrs',
    dash_next_spotlight_title: 'Your Next Scheduled Appointment',
    dash_none_upcoming: 'No upcoming appointments',
    dash_advisor_card_title: 'Your Senior Advisor',
    dash_advisor_desc: 'Certified Auditor & Tax Advisor. Dedicated to strategic structuring advisory and annual audits.',
    dash_chat_now: 'Contact Directly via Chat',
    dash_recent_activity: 'Recent Activity & Record Status',
    dash_all_appointments_btn: 'View All Appointments',

    // Customer Dashboard - Appointments Tab
    dash_apts_title: 'Client Appointments & File Status',
    dash_apts_subtitle: 'Full history of all booked consultations, status updates, and calendar integrations.',
    dash_filter_all: 'All',
    dash_filter_confirmed: 'Confirmed',
    dash_filter_pending: 'In Progress',
    dash_filter_rescheduled: 'Rescheduled',
    dash_filter_completed: 'Completed',
    dash_filter_cancelled: 'Cancelled',
    dash_apts_search: 'Search by advisor, service or location...',
    dash_download_ics: 'Calendar (.ics)',
    dash_reschedule_action: 'Request Reschedule',
    dash_cancel_action: 'Cancel',
    dash_no_matching_apts: 'No appointments match this filter.',
    dash_cancel_confirm_title: 'Cancel Appointment?',
    dash_cancel_confirm_desc: 'Are you sure you want to cancel this appointment? Your advisor will be notified.',
    dash_cancel_keep: 'Back & Keep Appointment',
    dash_cancel_proceed: 'Yes, Cancel Appointment',

    // Customer Dashboard - Analytics Tab
    dash_analytics_title: 'Mandate Analytics & Metrics',
    dash_analytics_subtitle: 'Transparent overview of mandate interactions, service allocation, and annual timeline.',
    dash_analytics_status_dist: 'Appointment Status Distribution',
    dash_analytics_timeline: 'Monthly Appointment Timeline (2024)',
    dash_analytics_practice: 'Distribution by Practice Area',
    dash_analytics_compliance: 'Compliance & Data Protection',
    dash_analytics_compliance_desc: '100% GDPR-compliant data hosting on ISO-certified German servers with comprehensive audit logs.',

    // Customer Dashboard - Profile Tab
    dash_profile_title: 'Master Data & Client Profile',
    dash_profile_subtitle: 'Registered contact and corporate details for your ongoing advisory and tax services.',
    dash_profile_personal: 'Personal Details',
    dash_profile_firstname: 'First Name',
    dash_profile_lastname: 'Last Name',
    dash_profile_email: 'Email Address',
    dash_profile_phone: 'Mobile Phone for SMS & Inquiries',
    dash_profile_company_title: 'Company Information',
    dash_profile_company_name: 'Company / Organization',
    dash_profile_client_since: 'Client Since',
    dash_profile_mandate_scope: 'Mandate Scope',
    dash_profile_save: 'Save Changes',
    dash_profile_saving: 'Saving...',
    dash_profile_saved: 'Profile successfully updated!',
    dash_profile_security_box: 'Data Protection & Confidentiality',
    dash_profile_sec_p1: 'Professional legal & tax secrecy (§ 43 BRAO & § 57 StBerG)',
    dash_profile_sec_p2: 'End-to-end 256-bit encryption of all transmitted records',
    dash_profile_sec_p3: 'Server infrastructure Frankfurt am Main (ISO/IEC 27001)',

    // Customer Dashboard - Chat & Records Tab
    dash_chat_title: 'Client Chat & Document Exchange',
    dash_chat_subtitle: 'Secure direct communication & file transfer with A u.S team.',
    dash_chat_general_ticket: 'General Ticket / Client Inquiry',
    dash_chat_appointment_ticket: 'Appointment File',
    dash_chat_placeholder: 'Type a message or inquiry...',
    dash_chat_send: 'Send',
    dash_chat_upload: 'Upload Document',
    dash_chat_gallery: 'Files & Documents',
    dash_chat_no_files: 'No files attached yet.',
    dash_chat_you: 'You',
    dash_chat_advisor_label: 'Firm / Advisor',
    dash_chat_priority: 'High Priority / Urgent',

    // Universal Banners & Top Navigation
    dash_logged_in_as: 'Logged in as',
    dash_back_to_cockpit: 'Back to Cockpit',
    dash_login_register: 'Log In / Register',
    dash_booking_status: 'Booking Status',

    // Landing Page & Universal CTA
    landing_free_initial_check: 'Free Initial Evaluation',
    landing_professional_secrecy: 'Professional Secrecy (§ StBerG & WPO)',
    landing_founder_badge: 'Managing Partner & Senior Advisor',
    landing_request_appointment: 'Request Personal Consultation',
    landing_cta_heading: 'Ready for Strategic Advisory Consultation?',
    landing_cta_desc: 'Secure your confidential advisory consultation directly with firm founder Abdul Sattar.',
    landing_founder_journey_btn: 'About the Founder (Abdul Sattar)',

    // Founder Achievements Page
    founder_page_badge: 'Academic Profile & Career',
    founder_page_title: 'Abdul Sattar',
    founder_page_subtitle: 'Managing Partner & Corporate Advisor',
    founder_page_journey_title: 'Academic Journey & Milestones',
    founder_page_journey_desc: 'A chronological overview of university degrees, research dissertations, and honors of Abdul Sattar.',
    founder_page_disciplines_title: 'Four Academic Pillars of Integrated Advisory',
    founder_page_disciplines_subtitle: 'Interdisciplinary Mindset',
    founder_page_book_title: 'Schedule Your Confidential Meeting with Abdul Sattar',
    founder_page_book_desc: 'Benefit from profound expertise at the intersection of corporate consulting, media law, and governance.',
    founder_page_back_home: 'Back to Home',

    // Booking Steps & Calendar
    booking_allowed_range: 'Booking Window: Current & Next Month (Mon–Thu & Sat)',
    booking_available_badge: 'Available for Direct Booking',
    booking_next_month_badge: 'Next Month',
    booking_prev_month: 'Previous Month',
    booking_next_month: 'Next Month',
    booking_legend_selected: 'Selected',
    booking_legend_available: 'Available',
    booking_legend_locked: 'Locked / Future Month',
    booking_client_logged_in_notice: 'Your details have been pre-filled from your verified client profile.',
    booking_client_guest_notice: 'Book swiftly as a guest or sign in for automated profile fill.',
    booking_confirmed_badge: 'Appointment Confirmed',
    booking_ticket_header: 'Appointment Overview & Firm Details',
    booking_location_label: 'Location / Format:',
    booking_location_val: 'Maximilianstraße 35, Munich / Online Video Call',
    booking_contacts_label: 'Submitted Contact Info:',
    booking_book_another: '← Request Another Appointment',

    // Auth Modal & OTP
    auth_modal_badge: 'Client Authentication',
    auth_welcome_title: 'Welcome Back',
    auth_login_subtitle: 'Sign in with your email address and password.',
    auth_register_subtitle: 'Create your client account for 1-click booking & direct messaging.',
    auth_modal_login_tab: 'Log In',
    auth_modal_register_tab: 'Register',
    auth_email_label: 'Email Address *',
    auth_password_label: 'Password *',
    auth_firstname_label: 'First Name *',
    auth_lastname_label: 'Last Name *',
    auth_phone_label: 'Phone (for SMS & Verification) *',
    auth_address_label: 'Postal Address / Headquarters *',
    auth_company_label: 'Company / Organization (optional)',
    auth_login_btn: 'Sign In Now',
    auth_no_account: 'No account yet?',
    auth_register_now: 'Register now',
    auth_or: 'Or',
    auth_quick_access: 'Client Quick Access',
    auth_email_exists_title: 'Email already registered!',
    auth_email_exists_desc: 'This email is already on file in the firm portal.',
    auth_login_now: 'Sign in now →',
    auth_request_otp_btn: 'Request Verification Code',
    auth_otp_required_title: 'Email Verification Required',
    auth_otp_required_desc: 'We have sent a 6-digit security code to your email address.',
    auth_sandbox_title: 'Sandbox Activation Code (Instant Access):',
    auth_sandbox_desc: 'Since the email system is operating in sandbox/test mode, you can directly insert this code:',
    auth_sandbox_btn: 'Auto-fill Code',
    auth_confirm_register_btn: 'Verify & Create Account',
    auth_back_to_form: '← Edit details',
    auth_resend_code: 'Resend Code',
    auth_resend_wait: 'Resend in',

    // Signout Confirmation Modal
    signout_confirm_title: 'Do you really want to log out?',
    signout_confirm_desc: 'Your active session will end and all local data and credentials will be removed from this browser.',
    signout_cancel: 'Cancel',
    signout_proceed: 'Yes, log out now',

    // Footer
    footer_founder_profile: 'Firm Leadership & Profile',
    footer_founder_link: 'Career of Abdul Sattar',
    footer_office_hours_title: 'Office Hours',
    footer_office_hours_val: 'Mon – Thu: 09:00 – 18:00 | Sat: 09:00 – 18:00',
    footer_cert_title: 'Certification & Privacy',
    footer_cert_desc: 'Highest security standards, GDPR-compliant client administration, and encrypted file transfer.',
    footer_cert_badge: 'Certified Firm Infrastructure',
    footer_headquarters: 'Headquarters:',
  },

  ur: {
    nav_home: 'ہوم پیج',
    nav_services: 'خدمات اور مہارت',
    nav_why_us: 'A u.S کیوں؟',
    nav_advisors: 'ہمارے مشیران',
    nav_contact: 'رابطہ اور مقام',
    nav_book_btn: 'ملاقات بک کریں',
    nav_staff_login: 'اسٹاف لاگ ان',
    nav_tagline: 'لائپزگ میں بک کیپنگ اور آفس سروس',
    nav_accreditation: 'ذاتی • قابل اعتماد • منظم',
    nav_open_slots: '● مشاورتی ملاقاتیں دستیاب ہیں',

    hero_badge: 'A u. S Wirtschaftsberatung e.K. • لائپزگ',
    hero_heading_pre: 'پیشہ ورانہ خدمات برائے',
    hero_heading_highlight: 'بک کیپنگ اور آفس سروس',
    hero_heading_post: 'لائپزگ میں۔',
    hero_subheading: 'بطور بک کیپر، میں خود روزگار افراد، فری لانسرز اور کمپنیوں کو معمول کی تجارتی تنظیم اور بک کیپنگ کے ابتدائی کاموں میں معاونت فراہم کرتا ہوں۔ میرا مقصد آپ کو دفتری و انتظامی بوجھ سے آزاد کرنا اور تمام ریکارڈ کو منظم رکھنا ہے۔',
    hero_book_btn: 'مشاورتی وقت طے کریں',
    hero_services_btn: 'خدمات ملاحظہ کریں',
    hero_stat1_val: 'لائپزگ',
    hero_stat1_label: 'دفتر کا مقام',
    hero_stat1_sub: 'Lagerhofstraße 2, 04103 Leipzig',
    hero_stat2_val: '1:1',
    hero_stat2_label: 'ذاتی مشاورت',
    hero_stat2_sub: 'مخصوص مشیر ڈاکٹر عبدالستار',
    hero_stat3_val: 'e.K.',
    hero_stat3_label: 'رجسٹرڈ تجارتی فرم',
    hero_stat3_sub: 'Amtsgericht Leipzig • HRA 18879',
    hero_stat4_val: '100%',
    hero_stat4_label: 'قابل اعتماد اور منظم',
    hero_stat4_sub: 'روزمرہ انتظامی امور سے نجات',

    // Legal Notice / Disclaimer
    legal_notice_badge: 'جرمن قانون کے تحت اہم قانونی نوٹس',
    legal_notice_title: 'اہم وضاحت: کوئی ٹیکس ایڈوائزری (Steuerberatung) نہیں ہے',
    legal_notice_text: 'A u. S Wirtschaftsberatung e.K. کوئی ٹیکس ایڈوائزری فرم نہیں ہے اور قانونی ٹیکس مشاورتی خدمات فراہم نہیں کرتی۔ وہ تمام مشاورت اور خدمات جو جرمن قانون کے تحت خصوصی طور پر مجاز ٹیکس کنسلٹنٹس (Steuerberater) کے لیے مختص ہیں، پیش نہیں کی جاتیں۔',
    legal_notice_subtext: 'صارف کی درخواست پر، ٹیکس پراسیسنگ کے لیے مطلوبہ دستاویزات کو ترتیب اور تیار کر کے متعلقہ ٹیکس مشیر کے ساتھ مربوط کیا جا سکتا ہے۔',

    services_badge: 'ہماری خدمات',
    services_title: 'لائپزگ میں بک کیپنگ اور آفس سروس',
    services_subtitle: 'جرمن قانون کے تحت مجاز معمول کی بک کیپنگ، دفتری تنظیم اور تجارتی نظم و ضبط میں معاونت۔',
    services_filter_all: 'تمام خدمات',
    services_filter_tax: 'ٹیکس مشیر کے لیے تیاری',
    services_filter_audit: 'ریکارڈ کی تنظیم',
    services_filter_consulting: 'تجارتی معاونت',
    services_filter_finance: 'آفس آرگنائزیشن',
    services_filter_accounting: 'معمول کی بک کیپنگ',
    services_card_min: 'دورانیہ تقریباً',
    services_card_target: 'موزوں برائے',
    services_card_book: 'ملاقات کی درخواست کریں',
    services_card_popular: 'سب سے زیادہ مقبول',

    why_us_badge: 'ہمارے نمایاں فوائد',
    why_us_title: 'نمایاں کمپنیاں A u.S پر کیوں بھروسہ کرتی ہیں',
    why_us_subtitle: 'پیشہ ورانہ مہارت، صنعت کا گہرا علم اور مخلصانہ ذاتی تعلق ہماری پہچان ہے۔',
    pillar1_title: 'ذاتی سینئر پارٹنر رہنمائی',
    pillar1_desc: 'کوئی گمنام ہاٹ لائن نہیں۔ آپ کو ہمیشہ ایک مستقل اور انتہائی اہل سینئر پارٹنر دستیاب ہوگا۔',
    pillar2_title: 'ٹیکس اور قانونی تحفظ کی ضمانت',
    pillar2_desc: 'آڈیٹرز اور ٹیکس ایڈوائزرز کی دوہری مہارت دور اندیشانہ حکمت عملی کو یقینی بناتی ہے۔',
    pillar3_title: 'مکمل ڈیجیٹل طریقہ کار',
    pillar3_desc: 'DATEV کلاؤڈ اور کاغذی کارروائی سے پاک حقیقی وقت میں مالیاتی کنٹرول۔',
    pillar4_title: '24 گھنٹے میں یقینی جواب',
    pillar4_desc: 'ہم ٹیکس اور مالیاتی معاملات پر ہمیشہ بروقت، ٹھوس اور فوری رہنمائی فراہم کرتے ہیں۔',

    advisors_badge: 'سینئر پارٹنرز اور ماہرین',
    advisors_title: 'A u.S میں آپ کے مشیران',
    advisors_subtitle: 'ہمارے تجربہ کار چارٹرڈ آڈیٹرز اور ٹیکس کنسلٹنٹس سے براہ راست ملیں۔',
    advisors_book_with: 'مشیر کے ساتھ ملاقات کا وقت لیں',

    testimonials_badge: 'کلائنٹس کی آراء',
    testimonials_title: 'ہمارے پارٹنرز کی کامیابی کی کہانیاں',
    testimonials_subtitle: 'جانیں کہ ہم نے کمپنیوں کو پیچیدہ آڈٹ اور تنظیم نو میں کیسے کامیابی دلائی۔',

    faq_badge: 'اکثر پوچھے گئے سوالات',
    faq_title: 'مشاورتی ملاقات کے متعلق ضروری معلومات',
    faq_subtitle: 'ملاقات کے طریقہ کار اور تیاری سے متعلق تمام اہم تفصیلات۔',

    booking_flow_badge: 'آن لائن ملاقات کی بکنگ',
    booking_flow_title: 'صرف 4 آسان مراحل میں ملاقات بک کریں',
    step1_title: '1۔ سروس کا انتخاب',
    step1_sub: 'مشاورت کا شعبہ',
    step2_title: '2۔ تاریخ اور وقت',
    step2_sub: 'دستیاب اوقات',
    step3_title: '3۔ آپ کی تفصیلات',
    step3_sub: 'رابطہ اور کمپنی ڈیٹا',
    step4_title: '4۔ تصدیق',
    step4_sub: 'تفصیلات اور کیلنڈر',
    step1_choose_service: 'مطلوبہ مشاورتی موضوع منتخب کریں:',
    step1_service_scope: 'سروس کا دائرہ کار اور فوکس',
    step1_next_btn: 'تاریخ اور وقت کی طرف بڑھیں',
    step2_choose_date: 'اپنی پسندیدہ تاریخ منتخب کریں:',
    step2_choose_advisor: 'پسندیدہ مشیر',
    step2_any_advisor: 'کوئی بھی دستیاب اہل مشیر (تیز ترین وقت)',
    step2_slots_available: 'منتخب تاریخ کے دستیاب اوقات',
    step2_no_slots: 'اس تاریخ پر کوئی وقت خالی نہیں ہے۔ براہ کرم دوسری تاریخ منتخب کریں۔',
    step2_next_btn: 'اپنی معلومات کی طرف بڑھیں',
    step2_prev_btn: 'سروس کے انتخاب پر واپس جائیں',
    step3_client_title: 'ملاقات کے لیے آپ کی رابطہ تفصیلات',
    step3_full_name: 'مکمل نام *',
    step3_email: 'ای میل ایڈریس *',
    step3_phone: 'فون نمبر',
    step3_company: 'کمپنی / فرم (اختیاری)',
    step3_address: 'رہائشی پتہ / ہیڈ کوارٹر',
    step3_task_reason: 'ملاقات کا مقصد / کام',
    step3_notes: 'آپ کے سوالات اور پس منظر (اختیاری)',
    step3_gdpr_agree: 'میں پرائیویسی پالیسی کے مطابق اپنے ڈیٹا کی پروسیسنگ سے اتفاق کرتا ہوں۔',
    step3_submit_btn: 'ملاقات کی تصدیق کریں',
    step3_prev_btn: 'تاریخ اور وقت پر واپس جائیں',
    step4_confirmed_title: 'آپ کی ملاقات کامیابی سے بک ہو گئی ہے!',
    step4_confirmed_desc: 'ہم نے آپ کے ای میل ایڈریس پر تصدیقی ای میل بھیج دی ہے۔ ہمارا مشیر آپ سے گفتگو کا منتظر ہے۔',
    step4_ref_label: 'بکنگ ریفرنس نمبر',
    step4_download_ics: 'کیلنڈر فائل (.ics) ڈاؤن لوڈ کریں',
    step4_print: 'تصدیق نامہ پرنٹ کریں',
    step4_home_btn: 'ہوم پیج پر واپس جائیں',

    footer_about_title: 'A u.S کے بارے میں',
    footer_about_desc: 'میونخ میں ٹیکس مشاورت اور آڈیٹنگ کی سرکردہ ڈیجیٹل فرم۔',
    footer_links_title: 'فوری لنکس',
    footer_services_title: 'شعبہ جات',
    footer_contact_title: 'رابطہ اور مقام',
    footer_rights: 'A u.S بزنس کنسلٹنگ۔ جملہ حقوق محفوظ ہیں۔',
    footer_imprint: 'قوانین',
    footer_privacy: 'راز داری کی پالیسی',
    footer_terms: 'شرائط و ضوابط',

    // Admin
    overview: 'خلاصہ',
    appointments: 'ملاقاتیں',
    clients: 'موکلین',
    settings: 'ترتیبات',
    help: 'مدد',
    signout: 'لاگ آؤٹ',
    new_appointment: 'نئی ملاقات',
    portal_title: 'A u.S پورٹل',
    search_placeholder: 'تلاش کریں...',
    super_admin: 'سپر ایڈمن',
    advisor: 'مشیر',

    // Dashboard Stats
    stats_clients: 'موکلین',
    stats_active_clients: 'سسٹم میں فعال',
    stats_booked: 'بک شدہ ملاقاتیں',
    stats_total: 'کل بک شدہ',
    stats_confirmed: 'تصدیق شدہ',
    stats_secured: 'محفوظ اور تصدیق شدہ',
    stats_cancelled: 'منسوخ شدہ',
    stats_losses: 'منسوخی',
    next_appointments: 'اگلی آنے والی ملاقاتیں',
    today_and_upcoming: 'آج اور آنے والے',
    no_upcoming_apts: 'کوئی آنے والی ملاقاتیں نہیں ملیں۔',

    // Client Directory
    client_directory: 'موکلین کی ڈائریکٹری',
    client_subtitle: 'تمام رجسٹرڈ موکلین کا نظم کریں اور شراکت داری کا تاریخی ڈیٹا حاصل کریں۔',
    add_client: 'موکل شامل کریں',
    table_name: 'نام / کمپنی',
    table_email: 'ای میل ایڈریس',
    table_phone: 'فون نمبر',
    table_since: 'اس سال سے موکل',
    table_actions: 'اقدامات',
    view_appointments: 'ملاقاتیں دیکھیں',
    no_clients_found: 'کوئی موکل نہیں ملا۔',

    // Settings
    settings_account_profile: 'اکاؤنٹ پروفائل',
    settings_name: 'نام',
    settings_email: 'ای میل ایڈریس',
    settings_role: 'رسائی کا کردار',
    settings_admin: 'سسٹم ایڈمنسٹریٹر',
    settings_db_interface: 'ڈیٹا بیس انٹرفیس',
    settings_db_connected: 'ایپلیکیشن محفوظ طریقے سے ایک ریلیشنل Cloud SQL (PostgreSQL) انسٹانس سے منسلک ہے۔',
    settings_db_host: 'ہوسٹ: secure-cloud-sql-proxy',
    settings_db_status: 'حالت: فعال ● آن لائن',
    settings_db_engine: 'انجن: PostgreSQL 15.x',

    // Help
    help_center: 'مدد کا مرکز',
    help_welcome: 'A u.S بزنس کنسلٹنگ کے امدادی مرکز میں خوش آمدید۔ یہاں آپ کو ملاقاتوں کے انتظام کے لیے مدد ملے گی:',
    help_q1: '1۔ میں نئی ملاقات کیسے بک کروں؟',
    help_a1: 'سائیڈ بار کے بائیں جانب نیچے "نئی ملاقات" پر کلک کریں۔ پھر آپ موکل، سروس، تاریخ، اوقات اور نوٹ درج کر سکتے ہیں۔',
    help_q2: '2۔ میں نیا موکل کیسے بناؤں؟',
    help_a2: '"نئی ملاقات" والی ونڈو کھولیں، "موکل بنائیں" ٹیب پر جائیں، فارم پُر کریں اور "موکل بنائیں" پر کلک کریں۔',
    help_q3: '3۔ میں دستاویزات کیسے اپ لوڈ کروں؟',
    help_a3: 'کیلنڈر میں ملاقات کا انتخاب کریں۔ دائیں جانب، آپ کو "دستاویزات" کا سیکشن ملے گا۔ نام درج کریں اور "منسلک کریں" پر کلک کریں۔',

    // Appointment Details Sidebar
    details_title: 'ملاقات کی تفصیلات',
    details_client_since: 'اس سال سے موکل',
    details_no_phone: 'کوئی فون نمبر نہیں',
    details_service: 'سروس',
    details_date: 'تاریخ',
    details_time: 'وقت',
    details_status: 'حالت',
    details_notes: 'نوٹس',
    details_no_notes: 'کوئی نوٹ فراہم نہیں کیا گیا۔',
    details_documents: 'دستاویزات',
    details_doc_placeholder: 'دستاویز کا نام...',
    details_attach: 'منسلک کریں',
    details_confirm: 'تصدیق کریں',
    details_reschedule: 'دوبارہ شیڈول کریں',
    details_cancel: 'منسوخ کریں',

    // Calendar
    cal_week: 'ہفتہ',
    cal_month: 'مہینہ',
    cal_today: 'آج',

    // Modal
    modal_create_action: 'کارروائی بنائیں',
    modal_tab_book: 'ملاقات بک کریں',
    modal_tab_create: 'موکل رجسٹر کریں',
    modal_client_label: 'موکل *',
    modal_client_select: '-- موکل منتخب کریں --',
    modal_client_help: 'موکل نہیں ملا؟ "موکل رجسٹر کریں" ٹیب پر جائیں۔',
    modal_service_label: 'سروس *',
    modal_date_label: 'تاریخ *',
    modal_start_label: 'شروع کا وقت *',
    modal_end_label: 'ختم ہونے کا وقت *',
    modal_advisor_label: 'مشیر (اختیاری)',
    modal_advisor_none: '-- غیر تفویض شدہ / خود --',
    modal_notes_label: 'نوٹ',
    modal_notes_placeholder: 'مشاورت پر نوٹ...',
    modal_btn_book: 'ملاقات درج کریں',
    modal_btn_booking: 'ملاقات بک ہو رہی ہے...',
    modal_btn_client: 'موکل رجسٹر کریں',
    modal_btn_clienting: 'موکل رجسٹر ہو رہا ہے...',
    modal_client_name_label: 'موکل کا نام *',
    modal_client_name_placeholder: 'مثال کے طور پر: احمد اینڈ کمپنی',
    modal_client_email_label: 'ای میل ایڈریس *',
    modal_client_phone_label: 'فون نمبر',
    modal_client_since_label: 'موکل بننے کا سال',
    modal_client_error: 'نام اور ای میل ضروری ہیں۔',
    modal_client_success: 'کامیابی کے ساتھ رجسٹر ہو گیا!',

    // Status Values
    status_bestaetigt: 'تصدیق شدہ',
    status_ausstehend: 'زیر التواء',
    status_verschoben: 'دوبارہ شیڈول',
    status_storniert: 'منسوخ شدہ',

    // Customer Dashboard - Navigation & Shell
    dash_nav_cockpit: 'خلاصہ',
    dash_nav_appointments: 'ملاقاتیں اور حالت',
    dash_nav_analytics: 'تجزیات اور چارٹس',
    dash_nav_chat: 'چیٹ اور دستاویزات',
    dash_nav_profile: 'میرا پروفائل',
    dash_nav_book: 'نئی ملاقات',
    dash_nav_website: 'ویب سائٹ پر جائیں',
    dash_nav_logout: 'لاگ آؤٹ',
    dash_client_badge: 'موکل کاک پٹ',
    dash_status_online: 'آن لائن',

    // Customer Dashboard - Header
    dash_portal_badge: 'A u.S موکل پورٹل',
    dash_welcome: 'خوش آمدید',
    dash_search_placeholder: 'ملاقاتیں، فائلیں یا مشیر تلاش کریں...',
    dash_book_cta: 'ملاقات بک کریں',
    dash_profile_cta: 'پروفائل تبدیل کریں',
    dash_client_id: 'موکل آئی ڈی',
    dash_phone_unverified: 'فون غیر مصدقہ',

    // Customer Dashboard - Overview Tab
    dash_overview_banner_title: 'دوبارہ خوش آمدید',
    dash_overview_banner_desc: 'فرم A u.S کے تمام ٹیکس اور کاروباری مشاورتی دستاویزات تک آپ کی محفوظ رسائی۔',
    dash_kpi_total: 'کل ملاقاتیں',
    dash_kpi_active: 'تصدیق شدہ اور فعال',
    dash_kpi_upcoming: 'اگلی ملاقات',
    dash_kpi_hours: 'مشاورتی اوقات',
    dash_kpi_hours_unit: 'گھنٹے',
    dash_next_spotlight_title: 'آپ کی اگلی طے شدہ ملاقات',
    dash_none_upcoming: 'کوئی آنے والی ملاقات نہیں ہے',
    dash_advisor_card_title: 'آپ کا سینئر مشیر',
    dash_advisor_desc: 'سرٹیفائیڈ پبلک آڈیٹر اور ٹیکس مشیر۔ کارپوریٹ حکمت عملی اور سالانہ آڈٹ کے سربراہ۔',
    dash_chat_now: 'چیٹ میں براہ راست رابطہ کریں',
    dash_recent_activity: 'حالیہ سرگرمیاں اور دستاویزات کی حالت',
    dash_all_appointments_btn: 'تمام ملاقاتیں دیکھیں',

    // Customer Dashboard - Appointments Tab
    dash_apts_title: 'موکل کی ملاقاتیں اور ریکارڈ کی حالت',
    dash_apts_subtitle: 'تمام بک شدہ مشاورتوں، تبدیلیوں اور محفوظ کردہ کیلنڈر فائلوں کی مکمل تاریخ۔',
    dash_filter_all: 'تمام',
    dash_filter_confirmed: 'تصدیق شدہ',
    dash_filter_pending: 'زیر کارروائی',
    dash_filter_rescheduled: 'موخر شدہ',
    dash_filter_completed: 'مکمل شدہ',
    dash_filter_cancelled: 'منسوخ شدہ',
    dash_apts_search: 'مشیر، سروس یا مقام کے ذریعے تلاش کریں...',
    dash_download_ics: 'کیلنڈر فائل (.ics)',
    dash_reschedule_action: 'وقت تبدیلی کی درخواست',
    dash_cancel_action: 'منسوخ کریں',
    dash_no_matching_apts: 'اس فلٹر کے مطابق کوئی ملاقات نہیں ملی۔',
    dash_cancel_confirm_title: 'کیا ملاقات منسوخ کریں؟',
    dash_cancel_confirm_desc: 'کیا آپ واقعی اس ملاقات کو منسوخ کرنا چاہتے ہیں؟ ہمارے مشیر کو فوری مطلع کر دیا جائے گا۔',
    dash_cancel_keep: 'واپس جائیں اور رکھیں',
    dash_cancel_proceed: 'جی ہاں، منسوخ کریں',

    // Customer Dashboard - Analytics Tab
    dash_analytics_title: 'موکل کے تجزیات اور اہم اعداد و شمار',
    dash_analytics_subtitle: 'مشاورتی سیشنز، خدمات کی تقسیم اور سالانہ پیش رفت کا مکمل اور شفاف جائزہ۔',
    dash_analytics_status_dist: 'ملاقاتوں کی حالت کی تقسیم',
    dash_analytics_timeline: 'ماہانہ ملاقاتوں کی پیش رفت (2024)',
    dash_analytics_practice: 'شعبہ جات کے مطابق تقسیم',
    dash_analytics_compliance: 'قوانین کی پاسداری اور ڈیٹا تحفظ',
    dash_analytics_compliance_desc: '100% یورپی یونین کے GDPR قوانین کے مطابق جرمن سرورز پر مکمل محفوظ اور تصدیق شدہ ڈیٹا۔',

    // Customer Dashboard - Profile Tab
    dash_profile_title: 'بنیادی ڈیٹا اور موکل پروفائل',
    dash_profile_subtitle: 'ٹیکس اور کاروباری مشاورت کے لیے آپ کی محفوظ کردہ رابطے اور کمپنی کی تفصیلات۔',
    dash_profile_personal: 'ذاتی معلومات',
    dash_profile_firstname: 'پہلا نام',
    dash_profile_lastname: 'آخری نام',
    dash_profile_email: 'ای میل ایڈریس',
    dash_profile_phone: 'موبائل نمبر برائے ایس ایم ایس اور رابطہ',
    dash_profile_company_title: 'کمپنی کی معلومات',
    dash_profile_company_name: 'کمپنی / کاروباری نام',
    dash_profile_client_since: 'کس سال سے موکل ہیں',
    dash_profile_mandate_scope: 'مشاورت کا دائرہ کار',
    dash_profile_save: 'تبدیلیاں محفوظ کریں',
    dash_profile_saving: 'محفوظ ہو رہا ہے...',
    dash_profile_saved: 'پروفائل کامیابی سے اپ ڈیٹ ہو گیا!',
    dash_profile_security_box: 'ڈیٹا کا تحفظ اور پیشہ ورانہ راز داری',
    dash_profile_sec_p1: 'جرمن قوانین (§ 43 BRAO & § 57 StBerG) کے تحت مکمل پیشہ ورانہ رازداری',
    dash_profile_sec_p2: 'تمام ڈیٹا کی 256-بٹ اینڈ ٹو اینڈ اینکرپشن',
    dash_profile_sec_p3: 'فرینکفرٹ جرمنی میں محفوظ سرورز (ISO/IEC 27001)',

    // Customer Dashboard - Chat & Records Tab
    dash_chat_title: 'موکل چیٹ اور دستاویزات کا تبادلہ',
    dash_chat_subtitle: 'فرم A u.S کے ساتھ محفوظ مواصلات اور فائلوں کی ترسیل۔',
    dash_chat_general_ticket: 'عمومی ٹکٹ / موکل استفسار',
    dash_chat_appointment_ticket: 'ملاقات کی فائل',
    dash_chat_placeholder: 'پیغام یا استفسار درج کریں...',
    dash_chat_send: 'بھیجیں',
    dash_chat_upload: 'دستاویز اپ لوڈ کریں',
    dash_chat_gallery: 'فائلیں اور دستاویزات',
    dash_chat_no_files: 'ابھی تک کوئی فائل منسلک نہیں کی گئی۔',
    dash_chat_you: 'آپ',
    dash_chat_advisor_label: 'فرم / مشیر',
    dash_chat_priority: 'اہم ترجیح / فوری ضرورت',

    // Universal Banners & Top Navigation
    dash_logged_in_as: 'بطور لاگ ان',
    dash_back_to_cockpit: 'کاک پٹ پر واپس جائیں',
    dash_login_register: 'لاگ ان / رجسٹریشن',
    dash_booking_status: 'بکنگ کی تفصیلات',

    // Landing Page & Universal CTA
    landing_free_initial_check: 'مفت ابتدائی جائزہ',
    landing_professional_secrecy: 'پیشہ ورانہ رازداری (§ StBerG اور WPO)',
    landing_founder_badge: 'فرم کے بانی اور سینئر مشیر',
    landing_request_appointment: 'ذاتی ملاقات کی درخواست کریں',
    landing_cta_heading: 'کیا آپ اسٹریٹجک مشاورتی گفتگو کے لیے تیار ہیں؟',
    landing_cta_desc: 'فرم کے بانی عبدالستار کے ساتھ براہ راست اپنی خفیہ اور جامع مشاورتی نشست طے کریں۔',
    landing_founder_journey_btn: 'بانی (عبدالستار) کا تعلیمی سفر',

    // Founder Achievements Page
    founder_page_badge: 'علمی پروفائل اور تعلیمی سفر',
    founder_page_title: 'عبدالستار',
    founder_page_subtitle: 'فرم مالک اور کاروباری مشیر',
    founder_page_journey_title: 'علمی سفر اور اہم سنگ میل',
    founder_page_journey_desc: 'عبدالستار کی یونیورسٹی ڈگریوں، تحقیقی مقالہ جات اور اعزازات کا جامع تاریخی جائزہ۔',
    founder_page_disciplines_title: 'جامع مشاورت کے چار علمی ستون',
    founder_page_disciplines_subtitle: 'کثیر الجہتی فکری نقطہ نظر',
    founder_page_book_title: 'عبدالستار کے ساتھ اپنی ذاتی ملاقات طے کریں',
    founder_page_book_desc: 'کارپوریٹ مشاورت، میڈیا قانون، فلسفہ اور اسٹریٹجک قیادت میں وسیع تجربے سے براہ راست فائدہ اٹھائیں۔',
    founder_page_back_home: 'ہوم پیج پر واپس جائیں',

    // Booking Steps & Calendar
    booking_allowed_range: 'بکنگ کا وقت: موجودہ اور اگلا مہینہ (پیر تا جمعرات اور ہفتہ)',
    booking_available_badge: 'براہ راست بکنگ کے لیے دستیاب',
    booking_next_month_badge: 'اگلا مہینہ',
    booking_prev_month: 'پچھلا مہینہ',
    booking_next_month: 'اگلا مہینہ',
    booking_legend_selected: 'منتخب کردہ',
    booking_legend_available: 'دستیاب',
    booking_legend_locked: 'بند / اگلا مہینہ',
    booking_client_logged_in_notice: 'آپ کی تفصیلات آپ کے تصدیق شدہ موکل پروفائل سے شامل کر دی گئی ہیں۔',
    booking_client_guest_notice: 'بطور مہمان تیزی سے بک کریں یا خودکار ڈیٹا کے لیے لاگ ان کریں۔',
    booking_confirmed_badge: 'ملاقات کی تصدیق ہو گئی',
    booking_ticket_header: 'ملاقات کا خلاصہ اور فرم کی تفصیلات',
    booking_location_label: 'مقام / طریقہ کار:',
    booking_location_val: 'میکسیمیلیان شٹراسے 35، میونخ / آن لائن ویڈیو کال',
    booking_contacts_label: 'درج کردہ رابطہ معلومات:',
    booking_book_another: '← ایک اور ملاقات کی درخواست کریں',

    // Auth Modal & OTP
    auth_modal_badge: 'موکل کی تصدیق',
    auth_welcome_title: 'خوش آمدید',
    auth_login_subtitle: 'اپنے ای میل اور پاس ورڈ کے ساتھ سائن ان کریں۔',
    auth_register_subtitle: 'فوری بکنگ اور براہ راست چیٹ کے لیے اپنا اکاؤنٹ بنائیں۔',
    auth_modal_login_tab: 'لاگ ان',
    auth_modal_register_tab: 'رجسٹر کریں',
    auth_email_label: 'ای میل ایڈریس *',
    auth_password_label: 'پاس ورڈ *',
    auth_firstname_label: 'پہلا نام *',
    auth_lastname_label: 'آخری نام *',
    auth_phone_label: 'فون نمبر (برائے ایس ایم ایس و تصدیق) *',
    auth_address_label: 'رہائشی پتہ / ہیڈ کوارٹر *',
    auth_company_label: 'کمپنی / تنظیم (اختیاری)',
    auth_login_btn: 'ابھی سائن ان کریں',
    auth_no_account: 'ابھی تک اکاؤنٹ نہیں ہے؟',
    auth_register_now: 'ابھی رجسٹر کریں',
    auth_or: 'یا',
    auth_quick_access: 'فوری موکل رسائی',
    auth_email_exists_title: 'ای میل پہلے سے رجسٹرڈ ہے!',
    auth_email_exists_desc: 'یہ ای میل پہلے سے سسٹم میں موجود ہے۔',
    auth_login_now: 'ابھی سائن ان کریں ←',
    auth_request_otp_btn: 'تصدیقی کوڈ حاصل کریں',
    auth_otp_required_title: 'ای میل کی تصدیق درکار ہے',
    auth_otp_required_desc: 'ہم نے آپ کے ای میل ایڈریس پر 6 ہندسوں کا سیکیورٹی کوڈ بھیجا ہے۔',
    auth_sandbox_title: 'ٹیسٹ / سینڈ باکس تصدیقی کوڈ (فوری رسائی):',
    auth_sandbox_desc: 'چونکہ ای میل سسٹم ٹیسٹنگ موڈ میں ہے، آپ اس کوڈ کو ایک کلک سے خودکار داخل کر سکتے ہیں:',
    auth_sandbox_btn: 'کوڈ خودکار درج کریں',
    auth_confirm_register_btn: 'تصدیق کریں اور اکاؤنٹ بنائیں',
    auth_back_to_form: '← تفصیلات درست کریں',
    auth_resend_code: 'کوڈ دوبارہ بھیجیں',
    auth_resend_wait: 'دوبارہ بھیجیں',

    // Signout Confirmation Modal
    signout_confirm_title: 'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟',
    signout_confirm_desc: 'آپ کا سیشن ختم ہو جائے گا اور براؤزر سے تمام ڈیٹا اور اسناد صاف کر دی جائیں گی۔',
    signout_cancel: 'منسوخ کریں',
    signout_proceed: 'ہاں، ابھی لاگ آؤٹ کریں',

    // Footer
    footer_founder_profile: 'فرم کی قیادت اور پروفائل',
    footer_founder_link: 'عبدالستار کا تعلیمی سفر',
    footer_office_hours_title: 'اوقاتِ کار',
    footer_office_hours_val: 'پیر تا جمعرات: 09:00 تا 18:00 | ہفتہ: 09:00 تا 18:00',
    footer_cert_title: 'سرٹیفیکیشن اور رازداری',
    footer_cert_desc: 'اعلیٰ ترین سیکیورٹی معیار، جی ڈی پی آر کے مطابق موکلین کا ڈیٹا اور مکمل خفیہ مواصلات۔',
    footer_cert_badge: 'تصدیق شدہ فرم انفراسٹرکچر',
    footer_headquarters: 'فرم کا دفتر:',
  }
};
