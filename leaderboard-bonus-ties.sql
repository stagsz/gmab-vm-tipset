-- View powering the /leaderboard page: match_points + bonus_points per player.
-- Bonus scoring compares each player's bonus_answers.answer against the correct
-- answer(s) stored in bonus_correct_answers.correct_answer.
--
-- Ties: correct_answer may hold several teams separated by commas
-- (e.g. 'Irak, Tunisien' or 'Nederländerna, Tyskland, Frankrike'). A player scores
-- if their answer matches ANY of them. Matching is trimmed and case-insensitive.
-- Points: top_scorer/champion/bronze_winner = 20, most_goals/most_conceded_group = 10.
--
-- Idempotent; run in the Supabase SQL Editor. Reads only — creates a view, no data changes.

CREATE OR REPLACE VIEW leaderboard AS
SELECT pl.id AS player_id,
    pl.name,
    COALESCE(ms.match_points, (0)::bigint) AS match_points,
    COALESCE(bs.bonus_points, (0)::bigint) AS bonus_points,
    (COALESCE(ms.match_points, (0)::bigint) + COALESCE(bs.bonus_points, (0)::bigint)) AS total_points
   FROM ((players pl
     LEFT JOIN ( SELECT player_scores.player_id,
            sum(player_scores.points) AS match_points
           FROM player_scores
          GROUP BY player_scores.player_id) ms ON ((ms.player_id = pl.id)))
     LEFT JOIN ( SELECT ba.player_id,
            sum(
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM unnest(string_to_array(bca.correct_answer, ',')) AS ca(val)
                        WHERE lower(btrim(ca.val)) = lower(btrim(ba.answer))
                    ) THEN
                    CASE ba.question_key
                        WHEN 'top_scorer'::text THEN 20
                        WHEN 'champion'::text THEN 20
                        WHEN 'bronze_winner'::text THEN 20
                        WHEN 'most_goals_group'::text THEN 10
                        WHEN 'most_conceded_group'::text THEN 10
                        ELSE NULL::integer
                    END
                    ELSE 0
                END) AS bonus_points
           FROM (bonus_answers ba
             JOIN bonus_correct_answers bca ON ((bca.question_key = ba.question_key)))
          GROUP BY ba.player_id) bs ON ((bs.player_id = pl.id)))
  ORDER BY (COALESCE(ms.match_points, (0)::bigint) + COALESCE(bs.bonus_points, (0)::bigint)) DESC,
           COALESCE(ms.match_points, (0)::bigint) DESC;

GRANT SELECT ON leaderboard TO anon, authenticated;
