/**
 * Every user-visible string in the app, in one place.
 *
 * Shape: a flat map keyed by stable dot-paths, written twice — once in English,
 * once in Somali. `Dict` is derived from the English object, so `so` is
 * compile-checked against it: a missing key is a type error, and an extra key is
 * an excess-property error. That is the whole coverage mechanism — nothing
 * enumerates strings at runtime, and nothing can drift without failing
 * `npm run typecheck`.
 *
 * Somali-specific notes:
 *
 * - Somali has no productive plural suffix. Where a count appears, the number
 *   precedes an invariant singular noun (`6 la-talin`), which is ordinary
 *   Somali rather than a workaround. Never append `s` to an English noun.
 * - Figures are never written into the copy. Every number arrives through an
 *   interpolation parameter so the value keeps coming from the data.
 * - Seeded content (consultant names, titles, bios, reviews, specialisations,
 *   service names) is deliberately NOT in here: `data/index.ts` is not
 *   translated, so those stay English in both languages.
 */

/** Interpolated values substituted into `{placeholder}` slots. */
export type Params = Record<string, string | number>

export const languages = ['en', 'so'] as const

export type Lang = (typeof languages)[number]

export const DEFAULT_LANG: Lang = 'en'

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (languages as readonly string[]).includes(value)
}

/**
 * The `lang` preference lives under the app's localStorage prefix but is
 * deliberately NOT registered in `lib/storage`'s `KEYS`, so wiping the demo
 * data (`clearAll`) does not silently throw away the reader's language.
 */
export const LANG_STORAGE_KEY = 'consultanthub:lang'

export const en = {
  // ---- document / chrome ----------------------------------------------------
  'meta.title': 'Lataliye — Find the right consultant',
  'lang.label': 'Language',
  'lang.to_english': 'Switch to English',
  'lang.to_somali': 'Switch to Somali',

  // ---- shared vocabulary -----------------------------------------------------
  'terms.consultant': 'consultant',
  'terms.consultants': 'consultants',
  'terms.session': 'session',
  'terms.sessions': 'sessions',
  'terms.booking': 'booking',
  'terms.bookings': 'bookings',

  'common.free': 'Free',
  'common.minutes': '{duration} minutes',
  'common.sessions_delivered': '{count} sessions delivered',
  'common.view_all': 'View all',
  'common.rates_published':
    'Rates and availability are published for every listing.',
  'common.browse_all': 'Browse all',
  'common.hi': 'Hi,',
  'common.log_out': 'Log out',
  'common.log_in': 'Log in',
  'common.get_started': 'Get started',
  'common.dashboard': 'Dashboard',
  'common.create_account': 'Create an account',
  'common.book_consultant': 'Book a new consultant',
  'common.loading_form': 'One moment — the sign-in form is still loading.',

  // ---- relative dates (see i18n/datetime.ts) --------------------------------
  'time.today': 'Today',
  'time.tomorrow': 'Tomorrow',
  'time.yesterday': 'Yesterday',
  'time.in_days': 'In {days} days',
  'time.days_ago': '{days} days ago',

  // ---- meeting formats ------------------------------------------------------
  'meeting.video': 'video',
  'meeting.in_person': 'in person',

  // ---- status ---------------------------------------------------------------
  'status.PENDING': 'Pending',
  'status.CONFIRMED': 'Confirmed',
  'status.CANCELLED': 'Cancelled',
  'status.COMPLETED': 'Completed',

  // ---- trust sentence (lib/trust.ts) ----------------------------------------
  'trust.none': 'No consultants are listed yet.',
  'trust.all': 'All {total} listed have completed an identity check.',
  'trust.partial': '{verified} of the {total} listed have completed an identity check.',

  // ---- review framing (lib/reviews.ts) --------------------------------------
  'reviews.summary.showing': 'Showing {count} reviews',
  'reviews.summary.none': 'No reviews yet',
  'reviews.block.not_signed_in': 'Log in to review this consultant.',
  'reviews.block.no_completed_booking':
    'You can review a consultant once you have completed a session with them.',
  'reviews.block.already_reviewed':
    'You have already reviewed this session. Book another to leave another review.',
  'reviews.block.storage_unavailable':
    'Storage is unavailable in this browser, so a review you write would be lost on reload.',

  // ---- writing a review (components/consultants/ReviewForm.tsx) --------------
  'reviews.form.title': 'Write a review',
  'reviews.form.subtitle': 'About your completed session with {name}.',
  'reviews.form.stars_label': 'Your rating',
  'reviews.form.star_option': '{value} out of 5 stars',
  'reviews.form.stars_hint':
    'Use the arrow keys to move between stars, or pick one with the pointer.',
  'reviews.form.stars_required': 'Choose a rating to continue.',
  'reviews.form.body_label': 'Your review (optional)',
  'reviews.form.body_placeholder': 'What was the session like? What should the next person know?',
  'reviews.form.hint': 'Your first name and last initial are shown with the review.',
  'reviews.form.submit': 'Publish review',
  'reviews.form.saved': 'Your review is published. Thank you.',
  'reviews.form.refused':
    'That review could not be saved — the session may have been cancelled or already reviewed.',

  // ---- finishing a session (lib/booking.ts) ----------------------------------
  'appointments.complete': 'Mark as completed',

  // ---- navbar ---------------------------------------------------------------
  'nav.browse': 'Explore consultants',
  'nav.how_it_works': 'How it works',
  'nav.toggle_navigation': 'Toggle navigation',

  // ---- footer ---------------------------------------------------------------
  'footer.column_product': 'Product',
  'footer.column_company': 'Company',
  'footer.column_legal': 'Legal',
  'footer.browse_consultants': 'Browse consultants',
  'footer.pricing': 'Pricing',
  'footer.become_consultant': 'Become a consultant',
  'footer.client_dashboard': 'Client dashboard',
  'footer.contact_support': 'Contact support',
  'footer.terms': 'Terms of service',
  'footer.privacy': 'Privacy policy',
  'footer.blurb_rates':
    'Rates and availability are published for every listing.',
  'footer.blurb_cta':
    'Find the right person and book a session in minutes.',
  'footer.social_unavailable': '{name} — not available yet',
  'footer.copyright': '© {year} Lataliye. All rights reserved.',
  'footer.license': 'MIT licensed.',

  // ---- home: hero -----------------------------------------------------------
  'home.hero.eyebrow': 'Independent expertise',
  'home.hero.title_lead': 'Find your person.',
  'home.hero.title_accent': 'Move forward.',
  'home.hero.body':
    'Good advice changes things. Find a consultant who understands where you are, read what they actually know, and book a clear next step.',
  'home.hero.explore': 'Explore consultants',
  'home.hero.for_consultants': 'For consultants',
  'home.hero.dots_group': 'Featured consultant',
  'home.hero.next': 'Next consultant',
  'home.hero.position': ' ({position} of {total} featured)',

  // ---- home: top rated ------------------------------------------------------
  'home.top.title': 'More people worth a call',
  'home.top.description':
    'Ordered by sessions delivered, with every figure taken straight from the directory.',

  // ---- home: specialties ----------------------------------------------------
  'home.specialties.title': 'Start where your problem is',
  'home.specialties.all': 'All consultants',

  // ---- home: why book here --------------------------------------------------
  'home.why.title': 'Less risk on both sides of the call',
  'home.guarantee.identity_title': 'Identity checks, counted',
  'home.guarantee.identity_body': '{sentence} Rates and availability are published for every listing.',
  'home.guarantee.free_title': 'Free intro calls',
  'home.guarantee.free_body':
    'Every consultant offers a complimentary short call. Find out whether it is worth the longer session before you pay for it.',
  'home.guarantee.scheduling_title': 'No scheduling back-and-forth',
  'home.guarantee.scheduling_body':
    'Pick a service and an open slot directly. No email threads, no waiting to hear back about availability.',

  // ---- home: closing band ---------------------------------------------------
  'home.cta.title': 'Not sure who to book? Start with a free intro call.',
  'home.cta.body':
    'Every consultant offers a complimentary intro call. Low commitment, and it takes one click to book.',
  'home.cta.hire': 'Hire a consultant',
  'home.cta.become': 'Become a consultant',
  'home.proof.listed': 'Consultants listed',
  'home.proof.sessions_delivered': 'Sessions delivered',
  'home.proof.identity_checked': 'Identity-checked consultants',

  // ---- how it works ---------------------------------------------------------
  'how.eyebrow': 'How it works',
  'how.title': 'Three steps from searching to booked.',
  'how.step1.title': 'Search by specialty',
  'how.step1.body':
    'Filter verified consultants by expertise, session volume and rate so you only see people who fit.',
  'how.step2.title': 'Review the profile',
  'how.step2.body':
    'Read real experience, session counts, and the services they offer before you commit.',
  'how.step3.title': 'Pick a time and book',
  'how.step3.body':
    'Choose a service and an open slot. No email threads, no back-and-forth scheduling.',
  'how.ready': 'Ready to get started?',
  'how.browse': 'Browse consultants',

  // ---- directory ------------------------------------------------------------
  'directory.eyebrow': 'Directory',
  'directory.title': 'Browse consultants',
  'directory.description':
    '{count} consultants across {specialties} specialties. Search by name, expertise, or city.',
  'directory.sorted_by': ' · sorted by {label}',
  'directory.filters': 'Filters',
  'directory.clear_all': 'Clear all',
  'directory.show_results': 'Show {count}',
  'directory.close_filters': 'Close filters',
  'directory.empty_title': 'No consultants match those filters',
  'directory.empty_body_many':
    'Try removing a filter or two — combining several narrows results quickly.',
  'directory.empty_body_one': 'Try a different search term or specialty.',
  'directory.reset_filters': 'Reset filters',
  'directory.bookings_note': 'in this browser',
  'directory.bookings_manage': 'log in to manage yours',

  // ---- filter sidebar -------------------------------------------------------
  'filters.title': 'Filters',
  'filters.reset': 'Reset',
  'filters.search_placeholder': 'Name, expertise, or city',
  'filters.search_label': 'Search consultants',
  'filters.specialty': 'Specialty',
  'filters.all': 'All',
  'filters.max_rate': 'Max hourly rate',
  'filters.up_to': 'Up to',
  'filters.up_to_aria': 'Up to {rate} per hour',
  'filters.verified_only': 'Verified only',
  'filters.clear_search': 'Clear search',

  // ---- filter chips ---------------------------------------------------------
  // `search` and `specialty_value` carry a value that needs no surrounding word,
  // so the chip is the value plus its own punctuation.
  'chip.search': '"{value}"',
  'chip.specialty_value': '{value}',
  'chip.specialty': 'Specialty: {value}',
  'chip.max_rate': 'Under {value}/hr',
  'chip.verified_only': 'Verified only',

  // ---- sorting --------------------------------------------------------------
  'sort.label': 'Sort by',
  'sort.recommended': 'Recommended',
  'sort.rate-low': 'Rate: low to high',
  'sort.rate-high': 'Rate: high to low',
  'sort.sessions': 'Most sessions',

  // ---- consultant card ------------------------------------------------------
  'card.view_profile': 'View profile',
  // The apostrophe is a literal character, not an HTML entity: this value is
  // rendered through a JSX expression, where `&rsquo;` would print verbatim.
  'card.view_profile_named': 'View {name}’s profile',
  'card.verified': 'Verified',
  'card.responds': 'responds {time}',

  // ---- consultant profile ---------------------------------------------------
  'profile.not_found_title': 'Consultant not found',
  'profile.not_found_body':
    'That profile may have been removed or the link is incorrect.',
  'profile.not_found_cta': 'Back to directory',
  'profile.back_link': 'All consultants',
  'profile.replies': 'Replies {time}',
  'profile.stat_sessions': 'Sessions',
  'profile.stat_experience': 'Experience',
  'profile.stat_response': 'Response',
  'profile.stat_rate': 'Rate',
  'profile.about': 'About',
  'profile.services': 'Services',
  'profile.no_commitment': ' · no commitment',
  'profile.reviews_heading': 'Reviews',
  'profile.free_intro':
    '{name} offers a free {duration}-minute intro call. Browsing is free — you only need an account to confirm.',

  // ---- booking widget -------------------------------------------------------
  'booking.title': 'Book a session',
  'booking.subtitle': 'Pick a service, a date and a time.',
  'booking.service': 'Service',
  'booking.date': 'Date',
  'booking.available_times': 'Available times',
  'booking.booked_count': '{count} booked',
  'booking.no_slots': 'No free times on this date. Try another day.',
  'booking.format': 'Format',
  'booking.price_row': ' · {duration} min',
  'booking.intro_badge': 'Intro call',
  'booking.continue': 'Continue',
  'booking.log_in_to_book': 'Log in to book',
  'booking.browse_note':
    'You can browse freely — an account is only needed to book.',
  'booking.create_one': 'Create one',
  'booking.no_services': "This consultant hasn't published services yet.",
  'booking.error_choose': 'Choose a service and a time first.',
  'booking.error_taken': 'That slot was just taken. Pick another time.',
  'booking.error_save': 'Something went wrong saving that booking.',

  // ---- booking: confirm -----------------------------------------------------
  'confirm.title': 'Confirm booking',
  'confirm.consultant': 'Consultant',
  'confirm.service': 'Service',
  'confirm.when': 'When',
  'confirm.format': 'Format',
  'confirm.price': 'Price',
  'confirm.back': 'Back',
  'confirm.confirm': 'Confirm',

  // ---- booking: done --------------------------------------------------------
  'done.title': "You're booked",
  'done.body': '{service} — booked with {name} on {date} at {time} ({endTime}).',
  'done.view_appointments': 'View my appointments',
  'done.another': 'Book another session',
  'done.no_storage':
    'Storage is unavailable, so this booking will not survive a reload.',

  // ---- login / register ------------------------------------------------------
  // Titles and subtitles only. The forms themselves are Clerk's components and
  // carry their own strings, which Clerk localises; what lives here is the
  // copy the page wraps around them, so it stays in this dictionary and in both
  // languages. There are no longer demo credentials to offer — accounts are
  // created by signing up.
  'login.title': 'Welcome back',
  'login.subtitle': 'Log in to manage your bookings.',
  'login.no_account': "Don't have an account?",

  'register.title': 'Create your account',
  'register.subtitle':
    'One account for everyone. Free to join, and it takes under a minute.',
  'register.already': 'Already registered?',

  // ---- become a consultant --------------------------------------------------
  'become.title': 'Keep your client account. Add a consultant one.',
  'become.body':
    'Registration on Lataliye is the same for everyone — nobody is asked up front whether they plan to hire or to be hired. Offering your services is a separate switch you can flip whenever you want, without starting over.',
  'become.step1_title': 'One account, either way',
  'become.step1_body':
    'Sign up the same way as anyone else. There is no consultant-only sign-up to fill in first.',
  'become.step2_title': 'Switch when it suits you',
  'become.step2_body':
    'Turn on your consultant profile in one click. Nothing you have booked as a client is affected.',
  'become.step3_title': 'Stay in control of availability',
  'become.step3_body':
    'Set the hours you are free, the services you offer, and your rates — clients only see the slots you publish.',

  // ---- offer services card --------------------------------------------------
  'offer.eyebrow': 'Independent option',
  'offer.title': 'Do you offer services too?',
  'offer.body':
    'One account does both jobs. Switch your profile to a consultant whenever you want — every session you have already booked stays exactly where it is.',
  'offer.on': 'Consultant profile on',
  'offer.on_note':
    'Listing your services and availability comes with the consultant dashboard.',
  'offer.button': 'Offer my services',
  'offer.button_note': 'One click. No new account, no new password.',
  'offer.error': 'That did not save. Check your connection and try again.',
  'offer.guest_note': 'Registration is the same for everyone.',

  // ---- auth shell aside -----------------------------------------------------
  'aside.find_person': 'Find the right person and book a session in minutes.',

  // ---- dashboard layout -----------------------------------------------------
  'dash.nav_overview': 'Overview',
  'dash.nav_appointments': 'Appointments',
  'dash.nav_find': 'Find consultants',
  'dash.eyebrow': 'Client portal',
  'dash.title_welcome': 'Welcome back, {name}',
  'dash.sub_dashboard': 'Your upcoming sessions and history at a glance.',
  'dash.sub_appointments': 'Every session you have booked.',

  // ---- client dashboard -----------------------------------------------------
  'client.login_title': 'Log in to see your dashboard',
  'client.login_body':
    'Your bookings, messages, and history live here once you sign in.',
  'client.stat_upcoming': 'Upcoming',
  'client.stat_completed': 'Completed',
  'client.stat_cancelled': 'Cancelled',
  'client.stat_spent': 'Total spent',
  'client.next_session': 'Next session',
  'client.with': 'with {name}',
  /** The same word when the name is a separate element (a link). */
  'client.with_prefix': 'with',
  'client.manage_booking': 'Manage booking',
  'client.section_upcoming': 'Upcoming',
  'client.section_history': 'History',
  'client.empty_booked_title': 'Nothing booked yet',
  'client.empty_booked_body':
    'Browse the directory and book an intro call — every consultant offers a free one.',
  'client.empty_booked_cta': 'Find a consultant',
  'client.empty_history_title': 'No past sessions',
  'client.empty_history_body':
    'Completed and cancelled bookings appear here.',
  'client.cancel': 'Cancel',
  'client.tap_again': 'Tap again to confirm',

  // ---- appointments ---------------------------------------------------------
  'appointments.tab_all': 'All',
  'appointments.tab_confirmed': 'Confirmed',
  'appointments.tab_pending': 'Pending',
  'appointments.tab_completed': 'Completed',
  'appointments.tab_cancelled': 'Cancelled',
  'appointments.filter_group': 'Filter appointments by status',
  'appointments.empty_all_title': 'No appointments yet',
  'appointments.empty_all_body':
    'Book an intro call to get started — every consultant offers a free one.',
  'appointments.empty_confirmed_title': 'No confirmed appointments yet',
  'appointments.empty_pending_title': 'No appointments awaiting confirmation',
  'appointments.empty_completed_title': 'No completed appointments yet',
  'appointments.empty_cancelled_title': 'No cancelled appointments',
  'appointments.empty_filtered_body':
    'Try a different filter to see your other bookings.',
  'appointments.browse': 'Browse consultants',
  'appointments.profile': 'Profile',
  'appointments.confirm': 'Confirm?',

  // ---- search input ---------------------------------------------------------
  'search.placeholder': 'Search',
  'search.clear': 'Clear search',

  // ---- rating ---------------------------------------------------------------
  'rating.sr_value': 'Rated {value} out of 5',
  'rating.none': 'No reviews yet',

  // ---- error boundary -------------------------------------------------------
  'error.title': 'Something broke',
  'error.body':
    'An unexpected error stopped the page from rendering. Reloading usually fixes it.',
  'error.try_again': 'Try again',
  'error.reload': 'Reload',
}

/** The shape every dictionary must satisfy. Derived from English. */
export type Dict = typeof en

export type MessageKey = keyof Dict

export const so: Dict = {
  // ---- document / chrome ----------------------------------------------------
  'meta.title': 'Lataliye — Hel qofka ku habboon',
  'lang.label': 'Luqad',
  'lang.to_english': 'Ku beddel Ingiriisiga',
  'lang.to_somali': 'Ku beddel Soomaaliga',

  // ---- shared vocabulary -----------------------------------------------------
  // Numerals take the noun in its singular attributive form in Somali, so the
  // invariant `la-talin` serves for one and for many.
  'terms.consultant': 'la-talin',
  'terms.consultants': 'la-talin',
  'terms.session': 'kulan',
  'terms.sessions': 'kulan',
  'terms.booking': 'ballan',
  'terms.bookings': 'ballan',

  'common.free': 'Bilaash',
  'common.minutes': '{duration} dheeme',
  'common.sessions_delivered': '{count} kulan oo la sameeyay',
  'common.view_all': 'Eeg dhammaan',
  'common.rates_published':
    'Qiimaha iyo waqtiyada ayaa qof kasta loo sheegay.',
  'common.browse_all': 'Eeg dhammaan',
  'common.hi': 'Salaan,',
  'common.log_out': 'Ka bax',
  'common.log_in': 'Soo gal',
  'common.get_started': 'Bilow',
  'common.dashboard': 'Xaraf',
  'common.create_account': 'Samee xisaab',
  'common.book_consultant': 'La-talin cusub ballan qabso',
  'common.loading_form': 'Sug daqiiqad — foomku weli wuu soo shubanayaa.',

  // ---- relative dates (see i18n/datetime.ts) --------------------------------
  'time.today': 'Maanta',
  'time.tomorrow': 'Berri',
  'time.yesterday': 'Shalay',
  'time.in_days': '{days} maalmood ka dib',
  'time.days_ago': '{days} maalmood ka hor',

  // ---- meeting formats ------------------------------------------------------
  'meeting.video': 'wacdo muuqaal',
  'meeting.in_person': 'isku-sii dhul',

  // ---- status ---------------------------------------------------------------
  'status.PENDING': 'La xafidin',
  'status.CONFIRMED': 'La ansixiyay',
  'status.CANCELLED': 'La joojiyay',
  'status.COMPLETED': 'La dhammaystiray',

  // ---- trust sentence (lib/trust.ts) ----------------------------------------
  'trust.none': 'Weli lama sheegin la-talin.',
  'trust.all':
    'Dhammaan {total} ee liiska ku jira ayaa dhammeeyay hubinta aqoonsiga.',
  'trust.partial':
    '{verified} oo ka mid ah {total} ayaa dhammeeyay hubinta aqonsiga.',

  // ---- review framing (lib/reviews.ts) --------------------------------------
  'reviews.summary.showing': '{count} oo la muujiyay',
  'reviews.summary.none': 'Weli tixraac ma jiro',
  'reviews.block.not_signed_in':
    'Si aad u tixraac la-talinta u qorto, marka hore soo gal.',
  'reviews.block.no_completed_booking':
    'Waad tixraac la-talin kastaa markaad la-talin la sameeyso kulan oo la dhammaystiray.',
  'reviews.block.already_reviewed':
    'Waxad tixraacdaan kulan hore loo qaatay. Si aad tixraac kale u qorto, ballan kale qabso.',
  'reviews.block.storage_unavailable':
    'Kaydintu ma diyaar tahay browser-kan, marka tixraacda aad qorto dib loo xaraskiinta ayuu baaba\'daa.',

  // ---- writing a review (components/consultants/ReviewForm.tsx) --------------
  'reviews.form.title': 'Qor tixraac',
  'reviews.form.subtitle': 'Kulankaaga oo la dhammaystiray ee {name}.',
  'reviews.form.stars_label': 'Hearkaaga',
  'reviews.form.star_option': '{value} oo ka mid ah 5 xiddidood',
  'reviews.form.stars_hint':
    'U isticmaal furaha arrow si aad u dhaqaaqo xiddidaha, ama ku dooro pointer-ka.',
  'reviews.form.stars_required': 'Dooro heer si aad hore u socon.',
  'reviews.form.body_label': 'Tixraacdaada (ikhtiyaari)',
  'reviews.form.body_placeholder':
    'Kulanku wuxuu noqday maxay? Qofka xiga waa maxay u baahan yahay inuu ogaado?',
  'reviews.form.hint': 'Magacaaga koowaad iyo xarafka ugu dambeeya ayaa tixraacda ku qoranaya.',
  'reviews.form.submit': 'Daabac tixraac',
  'reviews.form.saved': 'Tixraacdaada waa la daabacay. Mahadsanid.',
  'reviews.form.refused':
    'Tixraacdaas ma la keydin karin — kulanuhu wuxuu dhicii karo yahay ama horeyba waa la qaatay.',

  // ---- finishing a session (lib/booking.ts) ----------------------------------
  'appointments.complete': 'La dhammaystiray',

  // ---- navbar ---------------------------------------------------------------
  'nav.browse': 'Eeg la-taliyada',
  'nav.how_it_works': 'Sida ay u shaqeyso',
  'nav.toggle_navigation': 'Uqur navigation-ka',

  // ---- footer ---------------------------------------------------------------
  'footer.column_product': 'Adeeg',
  'footer.column_company': 'Shirkad',
  'footer.column_legal': 'Sharciga',
  'footer.browse_consultants': 'Eeg la-taliyada',
  'footer.pricing': 'Qiimaha',
  'footer.become_consultant': 'Noqo la-talin',
  'footer.client_dashboard': 'Xarafka macmiilka',
  'footer.contact_support': 'La xiriir taageero',
  'footer.terms': 'Sharciga adeegga',
  'footer.privacy': 'Siyaasadda sirta',
  'footer.blurb_rates': 'Qiimaha iyo waqtiyada ayaa qof kasta loo sheegay.',
  'footer.blurb_cta':
    'Hel qofka ku habboon oo ballan kulan qabso minut gudahood.',
  'footer.social_unavailable': '{name} — ma jiro hadda',
  'footer.copyright': '© {year} Lataliye. Xeer kasta waa la ilaaliyay.',
  'footer.license': 'Ruuxayntiisa waa MIT.',

  // ---- home: hero -----------------------------------------------------------
  'home.hero.eyebrow': 'Aqoonta kala duwan',
  'home.hero.title_lead': 'Hel qofkaag.',
  'home.hero.title_accent': 'Hadda u soco.',
  'home.hero.body':
    'Talo wanaagsan wax ka beddelaya. Hel la-talin fahmiyo halkaad joogto, akhri waxa uu dhab ahaantii uu qabo, ballan qabso talla talla ah oo cad.',
  'home.hero.explore': 'Eeg la-taliyada',
  'home.hero.for_consultants': 'La-taliyada u eg',
  'home.hero.dots_group': 'La-talin la soo bandhigay',
  'home.hero.next': 'La-talin xiga',
  'home.hero.position': ' ({position} oo ka mid ah {total})',

  // ---- home: top rated ------------------------------------------------------
  'home.top.title': 'Qofyo kale oo la wacagi karaa',
  'home.top.description':
    'Waxay ku kala horreeyaan tirada kulanada, tiro kastana waxay ka timid tahay liiska.',

  // ---- home: specialties ----------------------------------------------------
  'home.specialties.title': 'Ka shaqo halka dhibaatadaadu ku jirto',
  'home.specialties.all': 'Dhammaan la-talin',

  // ---- home: why book here --------------------------------------------------
  'home.why.title': 'Khatar yar oo labada dhinac',
  'home.guarantee.identity_title': 'Hubinta aqoonsiga, oo la tiray',
  'home.guarantee.identity_body':
    '{sentence} Qiimaha iyo waqtiyada ayaa qof kasta loo sheegay.',
  'home.guarantee.free_title': 'Wacqo hore oo bilaash',
  'home.guarantee.free_body':
    'La-talin kastaa wuxuu bixiyaa wacqo gaaban oo bilaash ah. Marka hore eeg inuu kula habboon yahay ka dibnaad kula qaadanayso ballan dhaadheer.',
  'home.guarantee.scheduling_title': 'Ma jiro hawl kugala dhigay oo dib loo celiyo',
  'home.guarantee.scheduling_body':
    'Dooro adeeg iyo goob furan si toos ah. Ma jiro sarrooyinka emaylka, ma jiro sugitaanka arrimaha.',

  // ---- home: closing band ---------------------------------------------------
  'home.cta.title': 'Ma garanayso la-talinta? Ku bilaab wacqo hore oo bilaash ah.',
  'home.cta.body':
    'La-talin kastaa wuxuu bixiyaa wacqo hore oo bilaash ah. Ballan adag ma baahna, hal guji oo keliya ayay kugu qabso lahaa.',
  'home.cta.hire': 'Qaado la-talin',
  'home.cta.become': 'Noqo la-talin',
  'home.proof.listed': 'La-taliyada liiska ku jira',
  'home.proof.sessions_delivered': 'Kulanado la sameeyay',
  'home.proof.identity_checked': 'La-talin la xaqiijay',

  // ---- how it works ---------------------------------------------------------
  'how.eyebrow': 'Sida ay u shaqeyso',
  'how.title': 'Saddex talaabo: raadi, eeg, ballan qabso.',
  'how.step1.title': 'Raadi khibrad',
  'how.step1.body':
    'Shaandhee la-taliyada la xaqiijay tirada kulanada, khibradda iyo qiimaha si aad u aragto qofyo kula habboon.',
  'how.step2.title': 'Eeg akhiska',
  'how.step2.body':
    'Akhri khibrad dhabta ah, tirada kulanada iyo adeegyada ayay bixiyaan ka hor intaadan go’aan gaarin.',
  'how.step3.title': 'Waqti dooro oo ballan qabso',
  'how.step3.body':
    'Dooro adeeg iyo goob furan. Ma jiro sarrooyinka emaylka, ma jiro dib-u-soo-saar cusub.',
  'how.ready': 'Diyaar ma u tahay?',
  'how.browse': 'Eeg la-taliyada',

  // ---- directory ------------------------------------------------------------
  'directory.eyebrow': 'Liiska la-taliyada',
  'directory.title': 'Eeg la-taliyada',
  'directory.description':
    '{count} la-talin oo {specialties} khibrad. Raadi magaca, aqoonta, ama magaalooyinka.',
  'directory.sorted_by': ' · sida loo habaysay: {label}',
  'directory.filters': 'Shaandho',
  'directory.clear_all': 'Ka saar dhammaan',
  'directory.show_results': 'Dhiib {count}',
  'directory.close_filters': 'Shaandhooyinka xir',
  'directory.empty_title': 'La-talin ma jiro oo u eg shaandhooyinkaas',
  'directory.empty_body_many':
    'Iska ka saar shaandho ama laba — isku darka badan ayaa si degdeg ah u yareeyaa natiijooyinka.',
  'directory.empty_body_one': 'Isku day erey kale ama khibrad kale.',
  'directory.reset_filters': 'Dib u celi shaandhooyinka',
  'directory.bookings_note': 'oo browser-kan gudihiisa',
  'directory.bookings_manage': 'soo gal si aad u maamusho',

  // ---- filter sidebar -------------------------------------------------------
  'filters.title': 'Shaandho',
  'filters.reset': 'Dib u celi',
  'filters.search_placeholder': 'Magac, aqoon, ama magaalo',
  'filters.search_label': 'Raadi la-taliyada',
  'filters.specialty': 'Khibrad',
  'filters.all': 'Dhammaan',
  'filters.max_rate': 'Qiimaha saacadka ugu sarreeya',
  'filters.up_to': 'Ila',
  'filters.up_to_aria': 'Ila {rate} saacad kasta',
  'filters.verified_only': 'La xaqiijay oo keliya',
  'filters.clear_search': 'Raadin nadiifi',

  // ---- filter chips ---------------------------------------------------------
  'chip.search': '"{value}"',
  'chip.specialty_value': '{value}',
  'chip.specialty': 'Khibrad: {value}',
  'chip.max_rate': 'Ka hooseeya {value} saacad kasta',
  'chip.verified_only': 'La xaqiijay oo keliya',

  // ---- sorting --------------------------------------------------------------
  'sort.label': 'Haleey',
  'sort.recommended': 'Waa lagu talagalay',
  'sort.rate-low': 'Qiimaha: hoose ilaa sarre',
  'sort.rate-high': 'Qiimaha: sarre ilaa hoose',
  'sort.sessions': 'Kulanado badan',

  // ---- consultant card ------------------------------------------------------
  'card.view_profile': 'Eeg akhiska',
  // Somali attaches possession to the noun, not to the name, so the name is
  // inserted unmodified and the sentence is built around it.
  'card.view_profile_named': 'Eeg akhiska ee {name}',
  'card.verified': 'La xaqiijay',
  'card.responds': 'wuxuu ka jawaabaa {time}',

  // ---- consultant profile ---------------------------------------------------
  'profile.not_found_title': 'La-talin lama helin',
  'profile.not_found_body':
    'Waxaa suurtogal in akhiskii la saaray ama in hyperlinkku khaldan yahay.',
  'profile.not_found_cta': 'Ku celi liiska',
  'profile.back_link': 'Dhammaan la-talin',
  'profile.replies': 'Wuxuu ka jawaabaa {time}',
  'profile.stat_sessions': 'Kulanado',
  'profile.stat_experience': 'Khibrad',
  'profile.stat_response': 'Jawaab',
  'profile.stat_rate': 'Qiimaha',
  'profile.about': 'Wixii la sheego',
  'profile.services': 'Adeegyada',
  'profile.no_commitment': ' · aan la ballaarin',
  'profile.reviews_heading': 'Tixraacyo',
  'profile.free_intro':
    '{name} wuxuu bixiyaa wacqo hore oo bilaash ah oo {duration} dheeme ah. Eegisadu waa bilaash — sii la haddaan oo keliya ayaad u baahan tahay si aad u xaqiijiso.',

  // ---- booking widget -------------------------------------------------------
  'booking.title': 'Kulan ballan qabso',
  'booking.subtitle': 'Dooro adeeg, taariikh iyo waqti.',
  'booking.service': 'Adeeg',
  'booking.date': 'Taariikh',
  'booking.available_times': 'Waqtiyada la heli karo',
  'booking.booked_count': '{count} la qabsaday',
  'booking.no_slots': 'Waqti bilaash ma jiro maanta. Isku day maal kale.',
  'booking.format': 'Nooca',
  'booking.price_row': ' · {duration} dheeme',
  'booking.intro_badge': 'Wacqo hore',
  'booking.continue': 'Sii wad',
  'booking.log_in_to_book': 'Soo gal si aad u ballan qabso',
  'booking.browse_note':
    'Si aad u eegto si buuxda oo bilaash ah — xisaab kaliya ayaa ballan qabasta loo baahan yahay.',
  'booking.create_one': 'Samee mid',
  'booking.no_services': 'La-talkan dhabtii ah weli uusan adeegyo daabacan.',
  'booking.error_choose': 'Marka hore dooro adeeg iyo waqti.',
  'booking.error_taken': 'Goortaas ayaa hadda la qabsaday. Dooro waqti kale.',
  'booking.error_save': 'Wax ku qaldan yahay marka ballan la keydiyay.',

  // ---- booking: confirm -----------------------------------------------------
  'confirm.title': 'Ballan xaqiiji',
  'confirm.consultant': 'La-talin',
  'confirm.service': 'Adeeg',
  'confirm.when': 'Goorta',
  'confirm.format': 'Nooca',
  'confirm.price': 'Qiimaha',
  'confirm.back': 'Dib u noqo',
  'confirm.confirm': 'Xaqiiji',

  // ---- booking: done --------------------------------------------------------
  'done.title': 'Ballan waa la qabsaday',
  'done.body': '{service} — oo {name} la qabsaday {date}, {time} ({endTime}).',
  'done.view_appointments': 'Eeg ballannadaada',
  'done.another': 'Kulan kale ballan qabso',
  'done.no_storage':
    'Kaydinta ma diyaar tahay, marka ballankan dib loo xareeysan ma raahdo.',

  // ---- login / register ------------------------------------------------------
  'login.title': 'Ku soo dhowow',
  'login.subtitle': 'Soo gal si aad u maamusho ballannadaada.',
  'login.no_account': 'Ma haysato xisaab?',

  'register.title': 'Samee xisaabtaada',
  'register.subtitle':
    'Hal xisaab oo qof walba. Ku-diiwaangelin waa bilaash, waxayna qaadataa wax ka yar ilbiriqsi.',
  'register.already': 'Horeybaa diiwaangeliyay?',

  // ---- become a consultant --------------------------------------------------
  'become.title': 'Xisaabtaada macmiilka ku hay. Halkan ku dar akhis la-talin.',
  'become.body':
    'Diiwaangelintu Lataliye waa isku mid ah qof walba — ma aan cidna hore weydiisan inuu qaarsanayo ama inuu qaarato. Bixinta adeegyadaada waa dooro kale oo keliya oo aad marka kasta oo aad rabto dooran kartaa, iyada oo aan dib u bilaabayn.',
  'become.step1_title': 'Hal xisaab, labada hab',
  'become.step1_body':
    'Isku qaab qof kale ka soo diiiwaangeli. Diiwaangelin kaliya oo la-talinta ah ma jiro oo hore loo buuxiyo.',
  'become.step2_title': 'Beddel marka ku habboon',
  'become.step2_body':
    'Hal guji ka shaqeeyo akhiskaaga la-talinta. Waxba oo aad macmiil ahaan u qabashay mid ahna ma la muuqaado.',
  'become.step3_title': 'Waqtiyadaada gudihiinta hay',
  'become.step3_body':
    'Sii waqtiyada aad ku qabasho karo, adeegyada aad bixiso, iyo qiimahaada — macmiilku wuxuu arkaa goobihii oo aad daabacay oo keliya.',

  // ---- offer services card --------------------------------------------------
  'offer.eyebrow': 'Doorasho kalenaab',
  'offer.title': 'Ma bixiso adeegyada kale?',
  'offer.body':
    'Hal xisaab ayaa labada shaqo qabta. U beddel akhiskaaga la-talin ah marka kasta oo aad rabto — kulan kasta oo horebaa u qabashay wuu meel isku dheeraa.',
  'offer.on': 'Akhiska la-talinta waa shaqeeya',
  'offer.on_note':
    'Sheegashada adeegyadaada iyo waqtiyadaada waxay ka timaaddaa xarafka la-talinta.',
  'offer.button': 'Bixi adeegyadayda',
  'offer.button_note': 'Hal guji. Xisaab cusub ma jiro, furryo cusubna ma jiro.',
  'offer.error': 'Kama dhammaateyn. Hubi xiriirkaada oo mar kale isku day.',
  'offer.guest_note': 'Diiwaangelintu waa isku mid ah qof walba.',

  // ---- auth shell aside -----------------------------------------------------
  'aside.find_person':
    'Hel qofka ku habboon oo ballan kulan qabso minut gudahood.',

  // ---- dashboard layout -----------------------------------------------------
  'dash.nav_overview': 'Guud',
  'dash.nav_appointments': 'Ballanad',
  'dash.nav_find': 'Raadi la-talin',
  'dash.eyebrow': 'Dhalwada macmiilka',
  'dash.title_welcome': 'Ku soo dhowow, {name}',
  'dash.sub_dashboard': 'Kulanadaada soo dhow iyo taariikhdaada halkan.',
  'dash.sub_appointments': 'Kulan kasta oo aad qabashay.',

  // ---- client dashboard -----------------------------------------------------
  'client.login_title': 'Si aad u aragto xarafkaaga, soo gal',
  'client.login_body':
    'Ballannadaada, fariimahaada iyo taariikhdaadu waxay halkan ku noqon doonaan isla marka aad galto.',
  'client.stat_upcoming': 'Soo dhow',
  'client.stat_completed': 'La dhammaystiray',
  'client.stat_cancelled': 'La joojiyay',
  'client.stat_spent': 'Waxaa la bixiyay guud',
  'client.next_session': 'Kulanka xiga',
  'client.with': 'kula {name}',
  'client.with_prefix': 'kula',
  'client.manage_booking': 'Maamulo ballan',
  'client.section_upcoming': 'Soo dhow',
  'client.section_history': 'Taariikhda',
  'client.empty_booked_title': 'Weli ballan lama qabsan',
  'client.empty_booked_body':
    'Eeg liiska oo ballan qabso wacqo hore — la-talin kastaa wuxuu bixiyaa mid bilaash ah.',
  'client.empty_booked_cta': 'Hel la-talin',
  'client.empty_history_title': 'Kulan hore umma jirto',
  'client.empty_history_body':
    'Ballannada la dhammaystiray iyo la joojiyay waxay halkan ka muuqdaan.',
  'client.cancel': 'Jooji',
  'client.tap_again': 'Mar kale ku dhuuji si aad u xaqiijiso',

  // ---- appointments ---------------------------------------------------------
  'appointments.tab_all': 'Dhammaan',
  'appointments.tab_confirmed': 'La ansixiyay',
  'appointments.tab_pending': 'La xafidin',
  'appointments.tab_completed': 'La dhammaystiray',
  'appointments.tab_cancelled': 'La joojiyay',
  'appointments.filter_group': 'Shaandhee ballannada xaaladdooda',
  'appointments.empty_all_title': 'Weli ballanad ma jiro',
  'appointments.empty_all_body':
    'Si aad u bilaabto, ballan qabso wacqo hore — la-talin kastaa wuxuu bixiyaa mid bilaash ah.',
  'appointments.empty_confirmed_title': 'Weli ballan la ansixiyay ma jiro',
  'appointments.empty_pending_title':
    'Weli ballan la xafidin ma jiro',
  'appointments.empty_completed_title': 'Weli ballan la dhammaystiray ma jiro',
  'appointments.empty_cancelled_title': 'Weli ballan la joojiyay ma jiro',
  'appointments.empty_filtered_body':
    'Isku day shaandho kale si aad u aragto ballannadaada kale.',
  'appointments.browse': 'Eeg la-taliyada',
  'appointments.profile': 'Akhis',
  'appointments.confirm': 'Xaqiiji?',

  // ---- search input ---------------------------------------------------------
  'search.placeholder': 'Raadi',
  'search.clear': 'Raadin nadiifi',

  // ---- rating ---------------------------------------------------------------
  'rating.sr_value': 'Heer {value} oo ka mid ah 5',
  'rating.none': 'Weli tixraac ma jiro',

  // ---- error boundary -------------------------------------------------------
  'error.title': 'Wax ku qaldan yahay',
  'error.body':
    'Khalad aan la filayn ayaa bogga ka horreeray inuu soo bandhigmo. Dib u xaraskiinta badanaa ayay ku xalisaa.',
  'error.try_again': 'Isku day mar kale',
  'error.reload': 'Dib u xarso',
}

/** Every language, keyed by code. English first so it is the default. */
export const dictionaries: Record<Lang, Dict> = { en, so }

/**
 * Fills `{placeholder}` slots from `params`.
 *
 * An unresolved placeholder is left in place rather than blanked: a missing
 * parameter is a developer error, and showing `{count}` is a visible defect
 * while silently printing nothing would be a false statement about the data.
 */
export function interpolate(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  )
}

/** Look up and interpolate a single string for a given language. */
export function translateIn(
  lang: Lang,
  key: MessageKey,
  params?: Params,
): string {
  return interpolate(dictionaries[lang][key], params)
}

/** The signature returned by `useTranslation().t`. */
export type Translate = (key: MessageKey, params?: Params) => string

/** Bound to English. Used as the default in `lib/`, whose checks pin English output. */
export const translateEn: Translate = (key, params) => translateIn('en', key, params)