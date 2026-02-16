'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Slider } from '@/components/shared/ui/slider';
import { Button } from '@/components/shared/ui/button';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  genre: string | null;
  mood: string | null;
  decade: string | null;
  minRating: number | null;
  sort: string;
}

const decades = ['2020', '2010', '2000', '1990', '1980', '1970', '1960', '1950'];

const sortOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'year', label: 'Year' },
  { value: 'title', label: 'Title' },
];

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    genre: null,
    mood: null,
    decade: null,
    minRating: null,
    sort: 'rating',
  });
  const [genres, setGenres] = useState<string[]>([]);
  const [moods, setMoods] = useState<any[]>([]);

  useEffect(() => {
    fetchGenres();
    fetchMoods();
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movies/genres');
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchMoods = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/moods');
      const data = await response.json();
      setMoods(data);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      genre: null,
      mood: null,
      decade: null,
      minRating: null,
      sort: 'rating',
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Genre Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Genre</label>
          <Select
            value={filters.genre || 'all'}
            onValueChange={(value) => updateFilter('genre', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mood Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Mood</label>
          <Select
            value={filters.mood || 'all'}
            onValueChange={(value) => updateFilter('mood', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All moods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All moods</SelectItem>
              {moods.map((mood) => (
                <SelectItem key={mood.id} value={mood.name}>
                  {mood.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Decade Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Decade</label>
          <Select
            value={filters.decade || 'all'}
            onValueChange={(value) => updateFilter('decade', value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All decades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All decades</SelectItem>
              {decades.map((decade) => (
                <SelectItem key={decade} value={decade}>
                  {decade}s
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div>
          <label className="text-sm font-medium mb-2 block">Sort By</label>
          <Select
            value={filters.sort}
            onValueChange={(value) => updateFilter('sort', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Minimum Rating: {filters.minRating ? `${filters.minRating}/10` : 'None'}
        </label>
        <Slider
          value={filters.minRating ? [filters.minRating] : [0]}
          onValueChange={(value) => updateFilter('minRating', value[0] === 0 ? null : value[0])}
          min={0}
          max={10}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
