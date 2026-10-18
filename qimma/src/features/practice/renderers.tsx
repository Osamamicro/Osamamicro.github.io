import type { ComponentType } from 'react';

import { Card, Text } from '@/components/ui';
import type { Item } from '@/core';

import { listeningRenderers } from './listening';
import { readingRenderers } from './reading';
import { speakingRenderers } from './speaking';
import type { RendererMap, RendererProps } from './types';
import { writingRenderers } from './writing';

const ALL: RendererMap = { ...speakingRenderers, ...writingRenderers, ...readingRenderers, ...listeningRenderers };

function Unsupported({ item }: RendererProps) {
  return (
    <Card tone="warning">
      <Text>“{item.type}” practice is coming soon.</Text>
    </Card>
  );
}

export function rendererFor(item: Item): ComponentType<RendererProps> {
  return (ALL[item.type] as ComponentType<RendererProps> | undefined) ?? Unsupported;
}
