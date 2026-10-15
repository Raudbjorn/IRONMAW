// Mirrors src/stories/layout/PageAnnotation.stories.svelte
import * as React from 'react';
import { Heading, PageAnnotation, PageSheet, Stack, Text } from '@svnbjrn/ironmaw';

export const OnAPage = () => (
  <PageSheet label="Page 1 · A4">
    <Stack gap={4}>
      <Heading level={2}>Starfsreynsla</Heading>
      <PageAnnotation index={1} label="Dates are ambiguous">
        <Text>Vefforritari, Dæmafyrirtæki ehf. · 2019 til nú</Text>
      </PageAnnotation>
      <PageAnnotation index={2} label="Claim has no figure" tone="error" active>
        <Text>Bætti afköst kerfisins verulega.</Text>
      </PageAnnotation>
      <PageAnnotation index={3} label="Consider a link" tone="accent">
        <Text>Þróaði innri vefþjónustu.</Text>
      </PageAnnotation>
    </Stack>
  </PageSheet>
);

export const Inline = () => (
  <PageSheet label="Page 1 · A4">
    <Text>
      Reynsla af{' '}
      <PageAnnotation as="span" index="a" label="Vague term">ýmsum tæknilausnum</PageAnnotation>{' '}
      í tíu ár.
    </Text>
  </PageSheet>
);
