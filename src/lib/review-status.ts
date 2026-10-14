// Review-status vocabulary — the stored values the library backend emits and
// the display copy the handoff (section 10) assigns to each. Statuses describe
// different aspects of a source; several can coexist and they are NOT a
// confidence scale. Three tones only (UI-2 component sheet):
//   act     — filled rust + triangle: act before using (Known issues)
//   care    — rust outline: take care before reusing
//   context — slate outline: supporting explanation, provenance, history
// No green, no "Verified": the index cannot establish correctness.
export type ReviewTone = 'act' | 'care' | 'context';

export type ReviewStatus =
  | 'known-errors'
  | 'review-required'
  | 'historical-reference'
  | 'historical-research'
  | 'historical-variant'
  | 'snapshot'
  | 'plan-only'
  | 'unbuilt-source'
  | 'unrendered-source'
  | 'unexecuted-code'
  | 'visual-reference'
  | 'private-correspondence'
  | 'generated-portrait-experiment'
  | 'placeholder'
  | 'context'
  | 'metadata';

export interface ReviewStatusCopy {
  label: string;
  tone: ReviewTone;
}

export const REVIEW_STATUS: Record<ReviewStatus, ReviewStatusCopy> = {
  'known-errors': { label: 'Known issues', tone: 'act' },
  'review-required': { label: 'Review before reuse', tone: 'care' },
  'historical-reference': { label: 'Historical reference', tone: 'context' },
  'historical-research': { label: 'Historical reference', tone: 'context' },
  'historical-variant': { label: 'Historical version', tone: 'context' },
  snapshot: { label: 'Preserved snapshot', tone: 'context' },
  'plan-only': { label: 'Plan only', tone: 'context' },
  'unbuilt-source': { label: 'Not built', tone: 'context' },
  'unrendered-source': { label: 'Not rendered', tone: 'context' },
  'unexecuted-code': { label: 'Code reference', tone: 'context' },
  'visual-reference': { label: 'Visual reference', tone: 'context' },
  'private-correspondence': { label: 'Private correspondence', tone: 'care' },
  'generated-portrait-experiment': { label: 'Generated image experiment', tone: 'care' },
  placeholder: { label: 'Incomplete example', tone: 'care' },
  context: { label: 'Context', tone: 'context' },
  metadata: { label: 'Metadata', tone: 'context' }
};

const TONE_ORDER: Record<ReviewTone, number> = { act: 0, care: 1, context: 2 };

/** Display copy for any stored value; unknown statuses surface their raw value in the plain tone rather than being hidden. */
export function reviewStatusCopy(status: string): ReviewStatusCopy {
  return (REVIEW_STATUS as Record<string, ReviewStatusCopy>)[status] ?? { label: status, tone: 'context' };
}

/** Sort stored statuses so "Known issues" leads a compact row. Stable within a tone. */
export function sortReviewStatuses(statuses: readonly string[]): string[] {
  return [...statuses].sort((a, b) => TONE_ORDER[reviewStatusCopy(a).tone] - TONE_ORDER[reviewStatusCopy(b).tone]);
}
