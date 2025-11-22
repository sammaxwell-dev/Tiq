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
  description: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    value: 'standard',
    label: 'Standard',
    description: 'Natural, accurate translation',
  },
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional and polite',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Friendly and relaxed',
  },
  {
    value: 'humorous',
    label: 'Humorous',
    description: 'Light and funny',
  },
  {
    value: 'code',
    label: 'Code',
    description: 'For programming terms',
  },
  {
    value: 'tldr',
    label: 'TL;DR',
    description: 'Short summary',
  },
];
