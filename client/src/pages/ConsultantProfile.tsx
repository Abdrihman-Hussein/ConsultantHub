import { Link, useParams } from 'react-router-dom'
import { getConsultant, getServicesFor } from '../data'
import { useApp } from '../context/AppContext'
import { canReview, ratingFor } from '../lib/reviews'
import { useTranslation } from '../i18n/LanguageContext'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Rating from '../components/ui/Rating'
import Card from '../components/ui/Card'
import Reveal from '../components/ui/Reveal'
import BookingWidget from '../components/consultants/BookingWidget'
import ReviewList from '../components/consultants/ReviewList'
import ReviewForm, { BLOCK_KEYS } from '../components/consultants/ReviewForm'

export default function ConsultantProfile() {
  const { id } = useParams<{ id: string }>();
  const consultant = id ? getConsultant(id) : undefined;
  const { session, appointments, reviews, isPersistent } = useApp();
  const { t } = useTranslation();

  if (!consultant) {
    return (
      <Container className="py-24 text-center">
        <Reveal>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-50 text-accent-500">
            <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="9" cy="9" r="5.5" />
              <path d="M13 13l4 4" strokeLinecap="round" />
            </svg>
          </span>
          <h1 className="mt-6 font-display text-display-md text-ink-950">
            {t('profile.not_found_title')}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-base text-muted">
            {t('profile.not_found_body')}
          </p>
          <Button to="/consultants" className="mt-8">
            {t('profile.not_found_cta')}
          </Button>
        </Reveal>
      </Container>
    );
  }

  const consultantServices = getServicesFor(consultant.id);

  // Computed from the reviews that exist. There is no seeded rating left to
  // fall back on, so an un-reviewed consultant reads as un-reviewed here too.
  const rating = ratingFor(consultant, reviews);

  // The same gate the form itself uses. Read here only to explain why the form
  // is or is not on the page — the form re-reads it every render.
  const reviewGate = canReview(
    consultant.id,
    session?.userId ?? null,
    appointments,
    reviews,
    new Date(),
    isPersistent,
  );

  // Labels only. `value` is derived from the consultant's own record, and
  // `experience` and `responseTime` are seeded strings that are deliberately
  // left as written.
  const stats = [
    { label: t('profile.stat_sessions'), value: `${consultant.sessions}+` },
    { label: t('profile.stat_experience'), value: consultant.experience },
    { label: t('profile.stat_response'), value: consultant.responseTime },
    { label: t('profile.stat_rate'), value: `$${consultant.hourlyRate}/hr` },
  ];

  const freeIntro = consultantServices.find((service) => service.isFree);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface-subtle">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-accent-100/40 blur-3xl"
        />

        <Container className="relative py-14">
          <Reveal>
            <Link
              to="/consultants"
              className="group mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink-950"
            >
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M16 10H4M9 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('profile.back_link')}
            </Link>
          </Reveal>

          <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
            <Reveal>
              <Avatar
                src={consultant.avatar || undefined}
                name={consultant.name}
                size="xl"
                className="ring-4 ring-surface-subtle shadow-card"
              />
            </Reveal>

            <Reveal delay={90} className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-display-lg text-ink-950">{consultant.name}</h1>
                {consultant.verified && <Badge tone="accent">{t('card.verified')}</Badge>}
              </div>
              <p className="mt-2 text-lg text-muted">{consultant.title}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                {/* Computed, not declared: this page shows the reviews
                    themselves immediately below, so a figure here would be
                    checked against them. */}
                <Rating value={rating} />
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M10 17.5s6-5.2 6-9.4a6 6 0 1 0-12 0c0 4.2 6 9.4 6 9.4z" />
                    <circle cx="10" cy="8" r="2" />
                  </svg>
                  {consultant.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <circle cx="10" cy="10" r="7" />
                    <path d="M10 6v4l2.5 1.5" strokeLinecap="round" />
                  </svg>
                  {t('profile.replies', { time: consultant.responseTime })}
                </span>
              </div>
            </Reveal>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 70}>
                <div className="h-full bg-surface px-5 py-4">
                  <dt className="text-xs text-subtle">{stat.label}</dt>
                  <dd className="mt-1 text-lg font-semibold tracking-tight text-ink-950">
                    {stat.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-12">
            <Reveal>
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-ink-950">
                  {t('profile.about')}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted">{consultant.bio}</p>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="text-lg font-semibold tracking-tight text-ink-950">
                  {t('profile.services')}
                </h2>
                <div className="mt-4 space-y-3">
                  {consultantServices.map((service) => (
                    <Card
                      key={service.id}
                      className="flex items-start justify-between gap-6 p-5 transition-all duration-300 hover:border-accent-300 hover:shadow-lift"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-ink-950">{service.name}</h3>
                          {service.isFree && <Badge tone="accent">{t('common.free')}</Badge>}
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">
                          {service.description}
                        </p>
                        <p className="mt-2.5 text-xs text-subtle">
                          {t('common.minutes', { duration: service.duration })}
                          {service.isFree && t('profile.no_commitment')}
                        </p>
                      </div>
                      <p className="shrink-0 text-lg font-semibold tracking-tight text-ink-950">
                        {service.isFree ? t('common.free') : `$${service.price}`}
                      </p>
                    </Card>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal>
              <ReviewList consultant={consultant} />
            </Reveal>

            <Reveal>
              <div className="space-y-4">
                <ReviewForm consultant={consultant} />
                {!reviewGate.ok && (
                  <p className="text-sm text-muted">
                    {BLOCK_KEYS[reviewGate.reason]
                      ? t(BLOCK_KEYS[reviewGate.reason])
                      : null}
                  </p>
                )}
              </div>
            </Reveal>

            {!session && freeIntro && (
              <Reveal>
                <Card className="border-accent-200 bg-accent-50/50 p-6">
                  <p className="text-sm text-accent-900">
                    {/* The duration is interpolated whole: Somali places the
                        number before the noun, so `<span>`-wrapping a fragment
                        of the sentence cannot work here. */}
                    {t('profile.free_intro', {
                      name: consultant.name,
                      duration: freeIntro.duration,
                    })}
                  </p>
                </Card>
              </Reveal>
            )}
          </div>

          <Reveal delay={120} className="lg:sticky lg:top-24">
            <BookingWidget consultant={consultant} services={consultantServices} />
          </Reveal>
        </div>
      </Container>
    </>
  );
}
