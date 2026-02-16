export interface MovieRecapContext {
  title: string;
  overview: string;
  tagline?: string;
  /** If false, instruct the model not to reveal the ending or major twists. */
  includeEnding?: boolean;
}

export interface SeriesEpisodeContext {
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  overview: string;
}

export interface SeriesRecapContext {
  seriesName: string;
  season: number;
  episodeFrom: number;
  episodeTo: number;
  episodes: SeriesEpisodeContext[];
}

export function buildMoviePrompt(ctx: MovieRecapContext): string {
  const spoilerInstruction =
    ctx.includeEnding === false
      ? 'Do not reveal the ending or major twists. Strike a balance between analysis and preserving the enjoyment of watching the film.'
      : 'You may include the ending and key revelations.';

  const taglineBlock = ctx.tagline ? `Tagline: ${ctx.tagline}\n\n` : '';

  return `Act as a skilled movie recap writer. Your task is to write a detailed, engaging recap of the following movie. Use only the information provided below; do not invent events or characters. Infer major characters and key moments from the plot summary where possible.

# Requirements

1. **Concise Summary**: Start with a captivating opening that summarizes the main storyline in concrete terms (what the protagonist faces, what they do, what’s at stake). Keep it engaging but state actual events, not vague mood.
2. **Character Overview**: Briefly introduce the major characters implied by the plot, their motivations, and how they contribute to the story. State **facts** about them; avoid filling space with rhetorical questions the reader cannot answer.
3. **Key Moments**: Identify and elaborate on **specific** pivotal plot points—what happens, who is involved, and what follows. Discuss why they matter. Do not replace plot with phrases like "something wicked stirs" or "darkness lurks"; name the events and outcomes.
4. **Humor and Commentary**: Incorporate light humor and witty observations where appropriate. Use a conversational, entertaining tone. Rhetorical questions are fine here and in the Conclusion.
5. **Engagement**: You may include rhetorical questions or prompts in **Commentary** and **Conclusion** only. In **Plot Summary** and **Character Breakdown**, state what happens and who the characters are—do not substitute questions for information.
6. **Well-Structured Format**: Use clear headings, bullet points for lists, and **bold** or *italic* for key phrases. Flow logically with clear transitions between sections.

# Avoid (vague / teaser language)

Do not use vague phrasing instead of plot. Prefer concrete descriptions of events and character actions. Avoid phrases such as: "something wicked," "darkness lurking," "evil afoot," "sinister secret," "we can only assume," "stirs up something," "genuine evil," "tangible darkness," "open, sinister arms," or any similar mood-only lines that do not say what actually occurs.

**Bad:** "Their arrival stirs up something wicked in the town."
**Good:** "When they return, [specific thing that happens]: e.g. they discover X, confront Y, and the town’s [specific person or force] does Z."

# Output Structure

Use this structure with markdown headings and formatting:

- **Introduction:** Brief hook that also states the core setup (who, what situation, what they’re trying to do).
- **Plot Summary:** What happens in the story—specific events and cause-and-effect. No beating around the bush.
- **Character Breakdown:** Main characters and their roles; state what we learn about them from the plot.
- **Pivotal Moments:** Key scenes or plot turns—what happens, who’s involved, what it leads to.
- **Conclusion:** Wrap up with final thoughts.

# Notes

- ${spoilerInstruction}
- Total length: aim for a detailed but concise recap (approximately 400–800 words). Do not write a 15,000-word script.
- Align tone with a conversational, analytical style that feels like a thoughtful video recap.

---

Title: ${ctx.title}
${taglineBlock}Plot: ${ctx.overview}


Now write the recap using the structure above.`;
}

export function buildSeriesPrompt(ctx: SeriesRecapContext): string {
  const episodesText = ctx.episodes
    .map(
      (e) =>
        `Season ${e.seasonNumber} Episode ${e.episodeNumber}:
${e.overview || 'No overview available.'}`
    )
    .join('\n\n');

  const rangeDesc =
    ctx.episodeFrom === ctx.episodeTo
      ? `Episode ${ctx.episodeFrom}`
      : `Episodes ${ctx.episodeFrom} through ${ctx.episodeTo}`;

  return `
You are writing a factual recap to refresh a viewer's memory.
This is NOT a promo and NOT a teaser.
Shorter episode ranges often produce clearer, more focused recaps.

Rules:
- Describe what actually happened, not themes.
- Mention character names when relevant.
- Explain cause-and-effect between events.
- Include concrete plot developments and revelations.
- Do NOT invent events or characters.
- Do NOT include anything beyond the episodes provided.
- Avoid vague or generic phrases.

Forbidden phrases include:
"new threats emerge", "the stakes rise", "a difficult choice",
"things escalate", "everything changes", "mysterious forces".

Series recap scope:
Season ${ctx.season}, ${rangeDesc}.

Episode summaries:
${episodesText}

Write a clear, grounded recap in paragraph form.
The goal is for the viewer to remember specific story events.
Do NOT use bullet points.
Do NOT add a title.
Do NOT use marketing language.
`;
}


export function buildMovieQuickPrompt(ctx: MovieRecapContext): string {
  const spoilerLine =
    ctx.includeEnding === false
      ? 'Do not reveal the ending or major twists.'
      : 'You may include key revelations.';
  return `You are a professional movie recap writer. Provide a quick catch-up in exactly 5 to 7 bullet points. Use the provided plot. Keep the tone engaging and concise. ${spoilerLine}

Title: ${ctx.title}
Plot: ${ctx.overview}

Bullet points (one per line, start each with "-"):`;
}

/**
 * Series recap prompt following the structured format from PROMPT.MD:
 * steps, output format with episode groupings, and notes.
 */
export function buildSeriesPromptStructured(ctx: SeriesRecapContext): string {
  const episodesText = ctx.episodes
    .map(
      (e) =>
        `Episode ${e.episodeNumber} "${e.name}": ${e.overview || 'No overview available.'}`
    )
    .join('\n');

  const totalEpisodes = ctx.episodes.length;
  const rangeDesc =
    ctx.episodeFrom === ctx.episodeTo
      ? `Episode ${ctx.episodeFrom}`
      : `Episodes ${ctx.episodeFrom} through ${ctx.episodeTo}`;

  return `Generate a detailed series recap covering ${rangeDesc} of Season ${ctx.season} for the TV series below. The recap should summarize key plot developments, character arcs, and major events in a concise yet comprehensive manner. Shorter episode ranges often produce clearer, more focused recaps. Ensure the recap is clear, structured, and easy to follow, providing context for important storylines without assuming prior detailed knowledge of the series.

# Steps

1. Identify the title of the TV series and confirm the specific season and episode range (${rangeDesc} of Season ${ctx.season}).
2. Summarize the main plot points and significant events in chronological order.
3. Highlight major character developments and changes throughout these episodes.
4. Mention any important relationships, conflicts, or resolutions.
5. Conclude with an overview of the narrative progression for this episode range.

# Output Format

- Provide the series name and season number as a heading.
- Use bullet points or short paragraphs to delineate episode groupings or key events.
- Keep summaries concise but informative, approximately 200-400 words in total.

# Example structure

Series: [Series Name]
Season: ${ctx.season}

Recap:
- Episodes 1-3: [Summary of key events and character developments]
- Episodes 4-6: [Summary of key events and character developments]
(Adjust grouping to match the episode range above.)

# Notes

- Adapt the recap based on the genre and tone of the series.
- Focus on plot relevance and avoid minor details that do not impact the main stories.
- Use neutral and clear language suitable for a general audience.
- Do NOT invent events or characters. Use only the episode information provided below.

---

Series: ${ctx.seriesName}
Season: ${ctx.season}
Episode range: ${rangeDesc}

Episode summaries:
${episodesText}

Now write the recap following the format above.`;
}

export function buildSeriesMergePrompt(seasonRecaps: string[]): string {
  const recapsText = seasonRecaps
    .map((text, i) => `Season ${i + 1} recap:\n${text}`)
    .join('\n\n---\n\n');

  return `You are writing a TV series "Previously on..." recap. Below are recaps for each season so far. Merge them into one cohesive "Previously on..." summary. Keep it engaging and avoid repeating details. Do not add new events.

${recapsText}

Merged "Previously on..." recap:`;
}
