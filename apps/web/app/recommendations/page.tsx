'use client';

import { useState, useEffect } from 'react';
import { MoodSelector } from '@/components/movies/MoodSelector';
import { RecommendationsGrid } from '@/components/movies/RecommendationsGrid';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function RecommendationsPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [maxDuration, setMaxDuration] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMood) {
      fetchRecommendations();
    }
  }, [selectedMood, selectedGenre, maxDuration]);

  const fetchRecommendations = async () => {
    if (!selectedMood) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        mood: selectedMood,
        limit: '20',
      });
      if (selectedGenre) params.append('genre', selectedGenre);
      if (maxDuration) params.append('maxDuration', maxDuration.toString());

      const response = await fetch(`http://localhost:3000/api/movies/recommendations?${params}`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Find Movies by Mood</h1>
          
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
            selectedGenre={selectedGenre}
            onGenreSelect={setSelectedGenre}
            maxDuration={maxDuration}
            onMaxDurationChange={setMaxDuration}
          />

          {selectedMood && (
            <div className="mt-8">
              {loading ? (
                <div className="text-center py-12">Loading recommendations...</div>
              ) : (
                <RecommendationsGrid movies={recommendations} />
              )}
            </div>
          )}

          {!selectedMood && (
            <div className="text-center py-12 text-muted-foreground">
              Select a mood to get personalized movie recommendations
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
