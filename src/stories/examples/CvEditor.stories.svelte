<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CvEditor from '../../examples/CvEditor.svelte';

  const { Story } = defineMeta({
    title: 'Examples/CV editor',
    component: CvEditor,
    args: { mode: 'check' },
    argTypes: { mode: { control: 'inline-radio', options: ['write', 'design', 'check'] } },
    parameters: {
      layout: 'fullscreen',
      docs: {
        description: {
          component:
            'A CV editor composed only from IRONMAW parts: AppHeader, SegmentedControl, SplitButton, Workspace, ' +
            'ScoreRing, Tabs, IssueCard, Disclosure, Input affixes, Switch, SwatchPicker, ReorderList, Menu, ' +
            'PageCanvas, PageSheet (Bone), PageAnnotation, ZoomControl and the Doc* parts. Score, counts and ' +
            'findings derive from the record; the fixes change it. People and contacts are fictional.'
        }
      }
    }
  });
</script>

<Story name="Check" />

<Story name="Design" args={{ mode: 'design' }} />

<Story name="Write" args={{ mode: 'write' }} />
