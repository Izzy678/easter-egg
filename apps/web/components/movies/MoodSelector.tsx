'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Slider } from '@/components/shared/ui/slider';

const moods = [
  { name: 'happy', label: 'Happy', icon: '😊' },
  { name: 'sad', label: 'Sad', icon: '😢' },
  { name: 'dark', label: 'Dark', icon: '🌑' },
  { name: 'romantic', label: 'Romantic', icon: '💕' },
  { name: 'nostalgic', label: 'Nostalgic', icon: '📼' },
  { name: 'adventurous', label: 'Adventurous', icon: '🏔️' },
  { name: 'thrilling', label: 'Thrilling', icon: '🎢' },
  { name: 'thoughtful', label: 'Thoughtful', icon: '🤔' },
];

const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi',
  'Thriller', 'Western',
];

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string | null) => void;
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
  maxDuration: number | null;
  onMaxDurationChange: (duration: number | null) => void;
}

export function MoodSelector({
  selectedMood,
  onMoodSelect,
  selectedGenre,
  onGenreSelect,
  maxDuration,
  onMaxDurationChange,
}: MoodSelectorProps) {
  const [genresList, setGenresList] = useState<string[]>([]);

  useEffect(() => {
    // Fetch available genres from API
    fetch('http://localhost:3000/api/movies/genres')
      .then((res) => res.json())
      .then((data) => setGenresList(data))
      .catch(() => setGenresList(genres)); // Fallback to default genres
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">How are you feeling?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moods.map((mood) => (
            <Button
              key={mood.name}
              variant={selectedMood === mood.name ? 'default' : 'outline'}
              onClick={() => onMoodSelect(selectedMood === mood.name ? null : mood.name)}
              className="h-auto py-4 flex flex-col gap-2"
            >
              <span className="text-2xl">{mood.icon}</span>
              <span>{mood.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {selectedMood && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Genre (Optional)</label>
            <Select value={selectedGenre || 'all'} onValueChange={(value) => onGenreSelect(value === 'all' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any genre</SelectItem>
                {(genresList.length > 0 ? genresList : genres).map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Max Duration: {maxDuration ? `${maxDuration} minutes` : 'No limit'}
            </label>
            <Slider
              value={maxDuration ? [maxDuration] : [180]}
              onValueChange={(value) => onMaxDurationChange(value[0] === 180 ? null : value[0])}
              min={60}
              max={240}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>60 min</span>
              <span>240 min</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
