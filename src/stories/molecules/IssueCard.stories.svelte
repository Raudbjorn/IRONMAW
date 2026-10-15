<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button, IssueCard, Stack, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/IssueCard',
    component: IssueCard,
    args: { index: 1, category: 'Parsing', title: 'Dates are ambiguous', tone: 'warning', active: false },
    argTypes: {
      tone: { control: 'inline-radio', options: ['warning', 'error', 'accent'] },
      children: { table: { disable: true } },
      actions: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'One finding about the document, numbered to match its marker on the page. Amber for findings, never rust. Active highlights the card when its block is selected.' } } }
  });
</script>

{#snippet body()}
  <Text size="sm" tone="muted">„2019 til nú“ may be read as a single year. Write a start and end month, for example „mars 2019 – nú“.</Text>
{/snippet}

{#snippet bodyClaim()}
  <Text size="sm" tone="muted">„Lækkaði kostnað verulega“ has no number. Add the amount or percentage, for example „lækkaði kostnað um 18%“.</Text>
{/snippet}

{#snippet bodyContact()}
  <Text size="sm" tone="muted">The phone number and email in the header are part of an image, so they can’t be read or copied. Add them as text.</Text>
{/snippet}

{#snippet bodyLink()}
  <Text size="sm" tone="muted">The portfolio is named but not linked. Add its address so a reader can open it.</Text>
{/snippet}

{#snippet acts()}
  <Button variant="secondary" size="xs">Show on page</Button>
  <Button variant="ghost" size="xs">Ignore</Button>
{/snippet}

<Story name="Warning" asChild>
  <IssueCard index={1} category="Parsing" title="Dates are ambiguous" children={body} actions={acts} />
</Story>

<Story name="Active" asChild>
  <IssueCard index={2} category="Content" title="Claim has no figure" active children={bodyClaim} actions={acts} />
</Story>

<Story name="Stacked list" asChild>
  <Stack gap={2}>
    <IssueCard index={1} title="Dates are ambiguous" children={body} />
    <IssueCard index={2} title="Contact line is an image" tone="error" children={bodyContact} />
    <IssueCard index={3} title="Consider adding a link" tone="accent" children={bodyLink} />
  </Stack>
</Story>
