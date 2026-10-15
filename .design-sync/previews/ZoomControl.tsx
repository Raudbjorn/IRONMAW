// Mirrors src/stories/molecules/ZoomControl.stories.svelte
import * as React from 'react';
import { ZoomControl } from '@svnbjrn/ironmaw';

export const Fit = () => <ZoomControl value="fit" pageCount={2} />;

export const Zoomed = () => <ZoomControl value={125} pageCount={1} />;

export const AtTheLimit = () => <ZoomControl value={400} pageCount={3} />;
