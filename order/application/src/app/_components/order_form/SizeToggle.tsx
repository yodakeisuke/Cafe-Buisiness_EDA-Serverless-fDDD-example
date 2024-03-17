'use client'

import React from 'react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/app/_components/ui/toggle-group"


interface SizeToggleProps {
  s?: boolean;
  m?: boolean;
  l?: boolean;
  onChange: (value: string) => void;
}

export function SizeToggle({ s = false, m = false, l = false, onChange }: SizeToggleProps) {
  const itemCount = [s, m, l].filter(Boolean).length;
  const gridColumnClass = itemCount === 3 ? 'grid-cols-3' : itemCount === 2 ? 'grid-cols-2' : 'grid-cols-1';

  const [value, setValue] = React.useState('left');

  return (
    <ToggleGroup
      type="single" size="default" variant="outline"
      value={value}
      onValueChange={(value) => {
        setValue(value)
        onChange(value)
      }}
      className={`grid ${gridColumnClass} w-full`}
    >
      {s && (
        <ToggleGroupItem value="s" aria-label="Toggle S">
          S
        </ToggleGroupItem>
      )}
      {m && (
        <ToggleGroupItem value="m" aria-label="Toggle M">
          M
        </ToggleGroupItem>
      )}
      {l && (
        <ToggleGroupItem value="l" aria-label="Toggle L">
          L
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
}
