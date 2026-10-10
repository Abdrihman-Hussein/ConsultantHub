import { useTranslation } from '../../../i18n/LanguageContext'
import type { MessageKey } from '../../../i18n/strings'
import type { MeetingType } from '../../../types'

interface FormatStepProps {
  selected: MeetingType;
  onSelect: (meetingType: MeetingType) => void;
}

/**
 * Meeting format.
 *
 * The two options are named in the dictionary rather than derived from the
 * `MeetingType` value: `in-person` stringified and capitalised is an English
 * construction ("In Person") that does not survive translation. The stored
 * value is unchanged — only its label is looked up.
 */
const FORMATS: { value: MeetingType; labelKey: MessageKey }[] = [
  { value: 'video', labelKey: 'meeting.video' },
  { value: 'in-person', labelKey: 'meeting.in_person' },
]

export default function FormatStep({ selected, onSelect }: FormatStepProps) {
  const { t } = useTranslation()

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-body">{t('booking.format')}</span>
      <div className="grid grid-cols-2 gap-2">
        {FORMATS.map((candidate) => (
          <button
            key={candidate.value}
            type="button"
            onClick={() => onSelect(candidate.value)}
            aria-pressed={selected === candidate.value}
            className={`rounded-xl border px-3 py-2 text-sm transition-all duration-200 ease-out ${
              selected === candidate.value
                ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
            }`}
          >
            {t(candidate.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}