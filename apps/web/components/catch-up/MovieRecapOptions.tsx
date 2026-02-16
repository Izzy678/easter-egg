'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Label } from '@/components/shared/ui/label';
import { Switch } from '@/components/shared/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/shared/ui/radio-group';
import { cn } from '@/lib/utils';

export type MovieRecapType = 'quick' | 'full';

export interface MovieRecapOptionsProps {
  onGenerate: (options: { recapType: MovieRecapType; includeEnding: boolean }) => void;
  generating?: boolean;
}

export function MovieRecapOptions({ onGenerate, generating = false }: MovieRecapOptionsProps) {
  const [recapType, setRecapType] = useState<MovieRecapType>('quick');
  const [includeEnding, setIncludeEnding] = useState(false);

  const handleSubmit = () => {
    onGenerate({ recapType, includeEnding });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold text-foreground">What recap do you want?</Label>
        <RadioGroup
          value={recapType}
          onValueChange={(v) => setRecapType(v as MovieRecapType)}
          className="mt-3 grid gap-3"
        >
          <label
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors',
              recapType === 'quick'
                ? 'border-primary-500/50 bg-primary-500/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            )}
          >
            <RadioGroupItem value="quick" id="recap-quick" className="mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Quick Recap</span>
              <p className="text-sm text-muted-foreground mt-0.5">2–3 min read</p>
            </div>
          </label>
          <label
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors',
              recapType === 'full'
                ? 'border-primary-500/50 bg-primary-500/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            )}
          >
            <RadioGroupItem value="full" id="recap-full" className="mt-0.5" />
            <div>
              <span className="font-medium text-foreground">Full Story Recap</span>
              <p className="text-sm text-muted-foreground mt-0.5">Complete plot summary</p>
            </div>
          </label>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
        <div>
          <Label htmlFor="include-ending" className="text-foreground font-medium">
            Include ending
          </Label>
          <p className="text-sm text-muted-foreground mt-0.5">Add how the story concludes</p>
        </div>
        <Switch
          id="include-ending"
          checked={includeEnding}
          onCheckedChange={setIncludeEnding}
        />
      </div>

      <Button
        size="lg"
        className="w-full sm:w-auto min-w-[200px]"
        onClick={handleSubmit}
        disabled={generating}
      >
        {generating ? 'Generating…' : 'Generate Recap'}
      </Button>
    </div>
  );
}
