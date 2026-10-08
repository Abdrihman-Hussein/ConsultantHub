import type { MeetingType } from '../../../types'

interface FormatStepProps {
  selected: MeetingType;
  onSelect: (meetingType: MeetingType) => void;
}

export default function FormatStep({ selected, onSelect }: FormatStepProps) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-body">Format</span>
      <div className="grid grid-cols-2 gap-2">
        {(['video', 'in-person'] as MeetingType[]).map((candidate) => (
          <button
            key={candidate}
            type="button"
            onClick={() => onSelect(candidate)}
            aria-pressed={selected === candidate}
            className={`rounded-xl border px-3 py-2 text-sm capitalize transition-all duration-200 ease-out ${
              selected === candidate
                ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
            }`}
          >
            {candidate.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}
