-- View powering the /facit page: per finished match, every player's prediction + points.
-- Scoring matches the player_scores view: exact score = 4, correct sign (1/X/2) = 1, else 0.
-- Idempotent; run in the Supabase SQL Editor. Reads only — creates a view, no data changes.

CREATE OR REPLACE VIEW match_facit AS
SELECT
  m.match_nr, m.match_date, m.group_letter,
  m.home_team, m.away_team,
  m.home_goals AS result_home, m.away_goals AS result_away,
  pl.id AS player_id, pl.name AS player_name,
  p.home_goals AS pred_home, p.away_goals AS pred_away,
  CASE
    WHEN p.home_goals = m.home_goals AND p.away_goals = m.away_goals THEN 4
    WHEN sign(p.home_goals - p.away_goals) = sign(m.home_goals - m.away_goals) THEN 1
    ELSE 0
  END AS points
FROM matches m
JOIN predictions p ON p.match_id = m.id
JOIN players pl    ON pl.id = p.player_id
WHERE m.status = 'finished'
  AND m.home_goals IS NOT NULL
  AND m.away_goals IS NOT NULL;

GRANT SELECT ON match_facit TO anon, authenticated;
