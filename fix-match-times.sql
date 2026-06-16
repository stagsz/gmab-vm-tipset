-- Fix all 72 match kick-off times
-- Source: official FIFA match schedule, cross-verified against ESPN / Al Jazeera / CBS / NBC / venue sites (2026-06-16)
-- Timezone rules: Mexico venues = UTC-6 (no DST since 2023), EDT = UTC-4, PDT = UTC-7, CDT (US) = UTC-5
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/kswvqbepcctmrdnpsxsh/sql/new
--
-- REQUIRED FIRST: match_date is a `date` column and would silently truncate the time.
-- Convert it to timestamptz so kick-off times are actually stored. Non-destructive; touches no other table.
ALTER TABLE matches ALTER COLUMN match_date TYPE timestamptz USING match_date::timestamptz;

UPDATE matches SET match_date = '2026-06-11T19:00:00Z' WHERE match_nr = 1;  -- Mexiko vs Sydafrika        13:00 UTC-6  Estadio Azteca
UPDATE matches SET match_date = '2026-06-12T02:00:00Z' WHERE match_nr = 2;  -- Sydkorea vs Czechia        20:00 UTC-6  Estadio Akron
UPDATE matches SET match_date = '2026-06-12T19:00:00Z' WHERE match_nr = 3;  -- Kanada vs Bosnien          15:00 EDT    BMO Field Toronto
UPDATE matches SET match_date = '2026-06-13T01:00:00Z' WHERE match_nr = 4;  -- USA vs Paraguay            18:00 PDT    SoFi Stadium
UPDATE matches SET match_date = '2026-06-14T01:00:00Z' WHERE match_nr = 5;  -- Haiti vs Skottland         21:00 EDT    Gillette Stadium
UPDATE matches SET match_date = '2026-06-14T04:00:00Z' WHERE match_nr = 6;  -- Australien vs Turkiet      21:00 PDT    BC Place
UPDATE matches SET match_date = '2026-06-13T22:00:00Z' WHERE match_nr = 7;  -- Brasilien vs Marocko       18:00 EDT    MetLife Stadium
UPDATE matches SET match_date = '2026-06-13T19:00:00Z' WHERE match_nr = 8;  -- Qatar vs Schweiz           15:00 EDT    Levi's Stadium
UPDATE matches SET match_date = '2026-06-14T23:00:00Z' WHERE match_nr = 9;  -- Elfenbenskusten vs Ecuador 19:00 EDT    Lincoln Financial
UPDATE matches SET match_date = '2026-06-14T17:00:00Z' WHERE match_nr = 10; -- Tyskland vs Curasao        12:00 CDT    NRG Stadium Houston (corrected: Houston is Central UTC-5)
UPDATE matches SET match_date = '2026-06-14T20:00:00Z' WHERE match_nr = 11; -- Nederlanderna vs Japan     15:00 CDT    AT&T Stadium (corrected: Arlington TX is Central UTC-5)
UPDATE matches SET match_date = '2026-06-15T02:00:00Z' WHERE match_nr = 12; -- Sverige vs Tunisien        20:00 UTC-6  Estadio BBVA Monterrey (corrected: Mexico UTC-6, KO 20:00 local)
UPDATE matches SET match_date = '2026-06-15T22:00:00Z' WHERE match_nr = 13; -- Saudiarabien vs Uruguay    18:00 EDT    Hard Rock Stadium
UPDATE matches SET match_date = '2026-06-15T16:00:00Z' WHERE match_nr = 14; -- Spanien vs Kap Verde       12:00 EDT    Mercedes-Benz Atlanta
UPDATE matches SET match_date = '2026-06-16T01:00:00Z' WHERE match_nr = 15; -- Iran vs Nya Zeeland        18:00 PDT    SoFi Stadium
UPDATE matches SET match_date = '2026-06-15T19:00:00Z' WHERE match_nr = 16; -- Belgien vs Egypten         12:00 PDT    Lumen Field
UPDATE matches SET match_date = '2026-06-16T19:00:00Z' WHERE match_nr = 17; -- Frankrike vs Senegal       15:00 EDT    MetLife Stadium
UPDATE matches SET match_date = '2026-06-16T22:00:00Z' WHERE match_nr = 18; -- Irak vs Norge              18:00 EDT    Gillette Stadium
UPDATE matches SET match_date = '2026-06-17T00:00:00Z' WHERE match_nr = 19; -- Argentina vs Algeriet      20:00 EDT    Arrowhead Stadium
UPDATE matches SET match_date = '2026-06-17T04:00:00Z' WHERE match_nr = 20; -- Osterrike vs Jordanien     21:00 PDT    Levi's Stadium
UPDATE matches SET match_date = '2026-06-17T23:00:00Z' WHERE match_nr = 21; -- Ghana vs Panama            19:00 EDT    BMO Field
UPDATE matches SET match_date = '2026-06-17T20:00:00Z' WHERE match_nr = 22; -- England vs Kroatien        15:00 CDT    AT&T Stadium (corrected: Arlington TX is Central UTC-5)
UPDATE matches SET match_date = '2026-06-17T17:00:00Z' WHERE match_nr = 23; -- Portugal vs Kongo          12:00 CDT    NRG Stadium Houston (corrected: Houston is Central UTC-5)
UPDATE matches SET match_date = '2026-06-18T02:00:00Z' WHERE match_nr = 24; -- Uzbekistan vs Colombia     20:00 UTC-6  Estadio Azteca
UPDATE matches SET match_date = '2026-06-18T16:00:00Z' WHERE match_nr = 25; -- Czechia vs Sydafrika       12:00 EDT    Mercedes-Benz Atlanta
UPDATE matches SET match_date = '2026-06-18T19:00:00Z' WHERE match_nr = 26; -- Schweiz vs Bosnien         15:00 EDT    SoFi Stadium
UPDATE matches SET match_date = '2026-06-18T22:00:00Z' WHERE match_nr = 27; -- Kanada vs Qatar            18:00 EDT    BC Place
UPDATE matches SET match_date = '2026-06-19T01:00:00Z' WHERE match_nr = 28; -- Mexiko vs Sydkorea         19:00 UTC-6  Estadio Akron
UPDATE matches SET match_date = '2026-06-20T00:30:00Z' WHERE match_nr = 29; -- Brasilien vs Haiti         20:30 EDT    Lincoln Financial
UPDATE matches SET match_date = '2026-06-19T22:00:00Z' WHERE match_nr = 30; -- Skottland vs Marocko       18:00 EDT    Gillette Stadium
UPDATE matches SET match_date = '2026-06-20T03:00:00Z' WHERE match_nr = 31; -- Turkiet vs Paraguay        20:00 PDT    Levi's Stadium
UPDATE matches SET match_date = '2026-06-19T19:00:00Z' WHERE match_nr = 32; -- USA vs Australien          12:00 PDT    Lumen Field
UPDATE matches SET match_date = '2026-06-20T20:00:00Z' WHERE match_nr = 33; -- Tyskland vs Elfenbenskusten 16:00 EDT   BMO Field
UPDATE matches SET match_date = '2026-06-21T00:00:00Z' WHERE match_nr = 34; -- Ecuador vs Curasao         19:00 CDT    Arrowhead Stadium (corrected: Kansas City is Central UTC-5)
UPDATE matches SET match_date = '2026-06-20T17:00:00Z' WHERE match_nr = 35; -- Nederlanderna vs Sverige   12:00 CDT    NRG Stadium Houston (corrected: Houston is Central UTC-5)
UPDATE matches SET match_date = '2026-06-21T04:00:00Z' WHERE match_nr = 36; -- Tunisien vs Japan          22:00 UTC-6  Estadio BBVA Monterrey (corrected: Mexico UTC-6, KO 22:00 local)
UPDATE matches SET match_date = '2026-06-21T22:00:00Z' WHERE match_nr = 37; -- Uruguay vs Kap Verde       18:00 EDT    Hard Rock Stadium
UPDATE matches SET match_date = '2026-06-21T16:00:00Z' WHERE match_nr = 38; -- Spanien vs Saudiarabien    12:00 EDT    Mercedes-Benz Atlanta
UPDATE matches SET match_date = '2026-06-21T19:00:00Z' WHERE match_nr = 39; -- Belgien vs Iran            12:00 PDT    SoFi Stadium
UPDATE matches SET match_date = '2026-06-22T01:00:00Z' WHERE match_nr = 40; -- Nya Zeeland vs Egypten     18:00 PDT    BC Place
UPDATE matches SET match_date = '2026-06-23T00:00:00Z' WHERE match_nr = 41; -- Norge vs Senegal           20:00 EDT    MetLife Stadium
UPDATE matches SET match_date = '2026-06-22T21:00:00Z' WHERE match_nr = 42; -- Frankrike vs Irak          17:00 EDT    Lincoln Financial
UPDATE matches SET match_date = '2026-06-22T17:00:00Z' WHERE match_nr = 43; -- Argentina vs Osterrike     12:00 CDT    AT&T Stadium (corrected: Arlington TX is Central UTC-5)
UPDATE matches SET match_date = '2026-06-23T03:00:00Z' WHERE match_nr = 44; -- Jordanien vs Algeriet      20:00 PDT    Levi's Stadium
UPDATE matches SET match_date = '2026-06-23T20:00:00Z' WHERE match_nr = 45; -- England vs Ghana           16:00 EDT    Gillette Stadium
UPDATE matches SET match_date = '2026-06-23T23:00:00Z' WHERE match_nr = 46; -- Panama vs Kroatien         19:00 EDT    BMO Field
UPDATE matches SET match_date = '2026-06-23T17:00:00Z' WHERE match_nr = 47; -- Portugal vs Uzbekistan     12:00 CDT    NRG Stadium Houston (corrected: Houston is Central UTC-5)
UPDATE matches SET match_date = '2026-06-24T02:00:00Z' WHERE match_nr = 48; -- Colombia vs Kongo          20:00 UTC-6  Estadio Akron
UPDATE matches SET match_date = '2026-06-24T22:00:00Z' WHERE match_nr = 49; -- Skottland vs Brasilien     18:00 EDT    Hard Rock Stadium
UPDATE matches SET match_date = '2026-06-24T22:00:00Z' WHERE match_nr = 50; -- Marocko vs Haiti           18:00 EDT    Mercedes-Benz Atlanta
UPDATE matches SET match_date = '2026-06-24T19:00:00Z' WHERE match_nr = 51; -- Schweiz vs Kanada          15:00 EDT    BC Place
UPDATE matches SET match_date = '2026-06-24T19:00:00Z' WHERE match_nr = 52; -- Bosnien vs Qatar           15:00 EDT    Lumen Field
UPDATE matches SET match_date = '2026-06-25T01:00:00Z' WHERE match_nr = 53; -- Czechia vs Mexiko          19:00 UTC-6  Estadio Azteca
UPDATE matches SET match_date = '2026-06-25T01:00:00Z' WHERE match_nr = 54; -- Sydafrika vs Sydkorea      19:00 UTC-6  Estadio BBVA
UPDATE matches SET match_date = '2026-06-25T20:00:00Z' WHERE match_nr = 55; -- Curasao vs Elfenbenskusten 16:00 EDT    Lincoln Financial
UPDATE matches SET match_date = '2026-06-25T20:00:00Z' WHERE match_nr = 56; -- Ecuador vs Tyskland        16:00 EDT    MetLife Stadium
UPDATE matches SET match_date = '2026-06-25T23:00:00Z' WHERE match_nr = 57; -- Japan vs Sverige           18:00 CDT    AT&T Stadium (corrected: Arlington TX is Central UTC-5)
UPDATE matches SET match_date = '2026-06-25T23:00:00Z' WHERE match_nr = 58; -- Tunisien vs Nederlanderna  18:00 CDT    Arrowhead Stadium (corrected: Kansas City is Central UTC-5)
UPDATE matches SET match_date = '2026-06-26T02:00:00Z' WHERE match_nr = 59; -- Turkiet vs USA             19:00 PDT    SoFi Stadium
UPDATE matches SET match_date = '2026-06-26T02:00:00Z' WHERE match_nr = 60; -- Paraguay vs Australien     19:00 PDT    Levi's Stadium
UPDATE matches SET match_date = '2026-06-26T19:00:00Z' WHERE match_nr = 61; -- Norge vs Frankrike         15:00 EDT    Gillette Stadium
UPDATE matches SET match_date = '2026-06-26T19:00:00Z' WHERE match_nr = 62; -- Senegal vs Irak            15:00 EDT    BMO Field
UPDATE matches SET match_date = '2026-06-27T03:00:00Z' WHERE match_nr = 63; -- Egypten vs Iran            20:00 PDT    Lumen Field
UPDATE matches SET match_date = '2026-06-27T03:00:00Z' WHERE match_nr = 64; -- Nya Zeeland vs Belgien     20:00 PDT    BC Place
UPDATE matches SET match_date = '2026-06-27T00:00:00Z' WHERE match_nr = 65; -- Kap Verde vs Saudiarabien  19:00 CDT    NRG Stadium Houston
UPDATE matches SET match_date = '2026-06-27T00:00:00Z' WHERE match_nr = 66; -- Uruguay vs Spanien         18:00 UTC-6  Estadio Akron
UPDATE matches SET match_date = '2026-06-27T21:00:00Z' WHERE match_nr = 67; -- Panama vs England          17:00 EDT    MetLife Stadium
UPDATE matches SET match_date = '2026-06-27T21:00:00Z' WHERE match_nr = 68; -- Kroatien vs Ghana          17:00 EDT    Lincoln Financial
UPDATE matches SET match_date = '2026-06-28T02:00:00Z' WHERE match_nr = 69; -- Algeriet vs Osterrike      21:00 CDT    Arrowhead Stadium (corrected: Kansas City is Central UTC-5)
UPDATE matches SET match_date = '2026-06-28T02:00:00Z' WHERE match_nr = 70; -- Jordanien vs Argentina     21:00 CDT    AT&T Stadium (corrected: Arlington TX is Central UTC-5)
UPDATE matches SET match_date = '2026-06-27T23:30:00Z' WHERE match_nr = 71; -- Colombia vs Portugal       19:30 EDT    Hard Rock Stadium
UPDATE matches SET match_date = '2026-06-27T23:30:00Z' WHERE match_nr = 72; -- Kongo vs Uzbekistan        19:30 EDT    Mercedes-Benz Atlanta
