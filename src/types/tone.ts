/**
 * Translation tone options
 */
export type TranslationTone =
  | 'standard'
  | 'formal'
  | 'casual'
  | 'humorous'
  | 'code'
  | 'tldr';

export interface ToneOption {
  value: TranslationTone;
  label: string;
  icon: string;
  description: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    value: 'standard',
    label: 'Standard',
    icon: '📝',
    description: 'Natural, accurate translation',
  },
  {
    value: 'formal',
    label: 'Formal',
    icon: '🎩',
    description: 'Professional and polite',
  },
  {
    value: 'casual',
    label: 'Casual',
    icon: '😊',
    description: 'Friendly and relaxed',
  },
  {
    value: 'humorous',
    label: 'Humorous',
    icon: '😄',
    description: 'Light and funny',
  },
  {
    value: 'code',
    label: 'Code',
    icon: '💻',
    description: 'For programming terms',
  },
  {
    value: 'tldr',
    label: 'TL;DR',
    icon: '⚡',
    description: 'Short summary',
  },
];
