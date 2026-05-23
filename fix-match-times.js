const { createClient } = require('@supabase/supabase-js');
const url = 'https://kswvqbepcctmrdnpsxsh.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzd3ZxYmVwY2N0bXJkbnBzeHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjgyNTcsImV4cCI6MjA5NDg0NDI1N30.55ebhAT9U9Wd0jXD_tRK9pLIrfX2ftaqPwuyyR-x-yY';
const sb = createClient(url, key, { auth: { persistSession: false } });

// All times UTC. Sources: Wikipedia group pages.
// Timezone rules applied:
//   Mexico venues (Azteca/Akron/BBVA): UTC-6 (Mexico abolished DST 2023)
//   US EDT venues (East/Central US arenas): UTC-4
//   US CDT venues (Houston/KC/Arlington): UTC-5
//   US PDT venues (LA/Seattle/Vancouver): UTC-7
//   Canada EDT (Toronto/Ottawa): UTC-4
//   Canada PDT (Vancouver): UTC-7

const updates = [
  // GROUP A
  { match_nr: 1,  match_date: '2026-06-11T19:00:00Z' }, // Mexiko vs Sydafrika        13:00 UTC-6 Estadio Azteca
  { match_nr: 2,  match_date: '2026-06-12T02:00:00Z' }, // Sydkorea vs Czechia        20:00 UTC-6 Estadio Akron
  { match_nr: 25, match_date: '2026-06-18T16:00:00Z' }, // Czechia vs Sydafrika       12:00 EDT   Mercedes-Benz Atlanta
  { match_nr: 28, match_date: '2026-06-19T01:00:00Z' }, // Mexiko vs Sydkorea         19:00 UTC-6 Estadio Akron
  { match_nr: 53, match_date: '2026-06-25T01:00:00Z' }, // Czechia vs Mexiko          19:00 UTC-6 Estadio Azteca
  { match_nr: 54, match_date: '2026-06-25T01:00:00Z' }, // Sydafrika vs Sydkorea      19:00 UTC-6 Estadio BBVA
  // GROUP B
  { match_nr: 3,  match_date: '2026-06-12T19:00:00Z' }, // Kanada vs Bosnien          15:00 EDT   BMO Field Toronto
  { match_nr: 8,  match_date: '2026-06-13T19:00:00Z' }, // Qatar vs Schweiz           15:00 EDT   Levi's Stadium
  { match_nr: 26, match_date: '2026-06-18T19:00:00Z' }, // Schweiz vs Bosnien         15:00 EDT   SoFi Stadium
  { match_nr: 27, match_date: '2026-06-18T22:00:00Z' }, // Kanada vs Qatar            18:00 EDT   BC Place
  { match_nr: 51, match_date: '2026-06-24T19:00:00Z' }, // Schweiz vs Kanada          15:00 EDT   BC Place
  { match_nr: 52, match_date: '2026-06-24T19:00:00Z' }, // Bosnien vs Qatar           15:00 EDT   Lumen Field
  // GROUP C
  { match_nr: 7,  match_date: '2026-06-13T22:00:00Z' }, // Brasilien vs Marocko       18:00 EDT   MetLife
  { match_nr: 5,  match_date: '2026-06-14T01:00:00Z' }, // Haiti vs Skottland         21:00 EDT   Gillette
  { match_nr: 30, match_date: '2026-06-19T22:00:00Z' }, // Skottland vs Marocko       18:00 EDT   Gillette
  { match_nr: 29, match_date: '2026-06-20T00:30:00Z' }, // Brasilien vs Haiti         20:30 EDT   Lincoln Financial
  { match_nr: 49, match_date: '2026-06-24T22:00:00Z' }, // Skottland vs Brasilien     18:00 EDT   Hard Rock
  { match_nr: 50, match_date: '2026-06-24T22:00:00Z' }, // Marocko vs Haiti           18:00 EDT   Mercedes-Benz Atlanta
  // GROUP D
  { match_nr: 4,  match_date: '2026-06-13T01:00:00Z' }, // USA vs Paraguay            18:00 PDT   SoFi Stadium
  { match_nr: 6,  match_date: '2026-06-14T04:00:00Z' }, // Australien vs Turkiet      21:00 PDT   BC Place
  { match_nr: 32, match_date: '2026-06-19T19:00:00Z' }, // USA vs Australien          12:00 PDT   Lumen Field
  { match_nr: 31, match_date: '2026-06-20T03:00:00Z' }, // Turkiet vs Paraguay        20:00 PDT   Levi's Stadium
  { match_nr: 59, match_date: '2026-06-26T02:00:00Z' }, // Turkiet vs USA             19:00 PDT   SoFi Stadium
  { match_nr: 60, match_date: '2026-06-26T02:00:00Z' }, // Paraguay vs Australien     19:00 PDT   Levi's Stadium
  // GROUP E
  { match_nr: 10, match_date: '2026-06-14T16:00:00Z' }, // Tyskland vs Curasao        12:00 EDT   NRG Houston
  { match_nr: 9,  match_date: '2026-06-14T23:00:00Z' }, // Elfenbenskusten vs Ecuador 19:00 EDT   Lincoln Financial
  { match_nr: 33, match_date: '2026-06-20T20:00:00Z' }, // Tyskland vs Elfenbenskusten 16:00 EDT  BMO Field
  { match_nr: 34, match_date: '2026-06-20T23:00:00Z' }, // Ecuador vs Curasao         19:00 EDT   Arrowhead KC
  { match_nr: 55, match_date: '2026-06-25T20:00:00Z' }, // Curasao vs Elfenbenskusten 16:00 EDT   Lincoln Financial
  { match_nr: 56, match_date: '2026-06-25T20:00:00Z' }, // Ecuador vs Tyskland        16:00 EDT   MetLife
  // GROUP F
  { match_nr: 11, match_date: '2026-06-14T19:00:00Z' }, // Nederlanderna vs Japan     15:00 EDT   AT&T Stadium
  { match_nr: 12, match_date: '2026-06-14T23:00:00Z' }, // Sverige vs Tunisien        19:00 EDT   Estadio BBVA
  { match_nr: 35, match_date: '2026-06-20T16:00:00Z' }, // Nederlanderna vs Sverige   12:00 EDT   NRG Houston
  { match_nr: 36, match_date: '2026-06-21T01:00:00Z' }, // Tunisien vs Japan          21:00 EDT   Estadio BBVA
  { match_nr: 57, match_date: '2026-06-25T22:00:00Z' }, // Japan vs Sverige           18:00 EDT   AT&T Stadium
  { match_nr: 58, match_date: '2026-06-25T22:00:00Z' }, // Tunisien vs Nederlanderna  18:00 EDT   Arrowhead KC
  // GROUP G
  { match_nr: 16, match_date: '2026-06-15T19:00:00Z' }, // Belgien vs Egypten         12:00 PDT   Lumen Field
  { match_nr: 15, match_date: '2026-06-16T01:00:00Z' }, // Iran vs Nya Zeeland        18:00 PDT   SoFi Stadium
  { match_nr: 39, match_date: '2026-06-21T19:00:00Z' }, // Belgien vs Iran            12:00 PDT   SoFi Stadium
  { match_nr: 40, match_date: '2026-06-22T01:00:00Z' }, // Nya Zeeland vs Egypten     18:00 PDT   BC Place
  { match_nr: 63, match_date: '2026-06-27T03:00:00Z' }, // Egypten vs Iran            20:00 PDT   Lumen Field
  { match_nr: 64, match_date: '2026-06-27T03:00:00Z' }, // Nya Zeeland vs Belgien     20:00 PDT   BC Place
  // GROUP H
  { match_nr: 14, match_date: '2026-06-15T16:00:00Z' }, // Spanien vs Kap Verde       12:00 EDT   Mercedes-Benz Atlanta
  { match_nr: 13, match_date: '2026-06-15T22:00:00Z' }, // Saudiarabien vs Uruguay    18:00 EDT   Hard Rock Miami
  { match_nr: 38, match_date: '2026-06-21T16:00:00Z' }, // Spanien vs Saudiarabien    12:00 EDT   Mercedes-Benz Atlanta
  { match_nr: 37, match_date: '2026-06-21T22:00:00Z' }, // Uruguay vs Kap Verde       18:00 EDT   Hard Rock Miami
  { match_nr: 65, match_date: '2026-06-27T00:00:00Z' }, // Kap Verde vs Saudiarabien  19:00 CDT   NRG Houston
  { match_nr: 66, match_date: '2026-06-27T00:00:00Z' }, // Uruguay vs Spanien         18:00 UTC-6 Estadio Akron
  // GROUP I
  { match_nr: 17, match_date: '2026-06-16T19:00:00Z' }, // Frankrike vs Senegal       15:00 EDT   MetLife
  { match_nr: 18, match_date: '2026-06-16T22:00:00Z' }, // Irak vs Norge              18:00 EDT   Gillette
  { match_nr: 42, match_date: '2026-06-22T21:00:00Z' }, // Frankrike vs Irak          17:00 EDT   Lincoln Financial
  { match_nr: 41, match_date: '2026-06-23T00:00:00Z' }, // Norge vs Senegal           20:00 EDT   MetLife
  { match_nr: 61, match_date: '2026-06-26T19:00:00Z' }, // Norge vs Frankrike         15:00 EDT   Gillette
  { match_nr: 62, match_date: '2026-06-26T19:00:00Z' }, // Senegal vs Irak            15:00 EDT   BMO Field
  // GROUP J
  { match_nr: 19, match_date: '2026-06-17T00:00:00Z' }, // Argentina vs Algeriet      20:00 EDT   Arrowhead KC
  { match_nr: 20, match_date: '2026-06-17T04:00:00Z' }, // Osterrike vs Jordanien     21:00 PDT   Levi's Stadium
  { match_nr: 43, match_date: '2026-06-22T16:00:00Z' }, // Argentina vs Osterrike     12:00 EDT   AT&T Stadium
  { match_nr: 44, match_date: '2026-06-23T03:00:00Z' }, // Jordanien vs Algeriet      20:00 PDT   Levi's Stadium
  { match_nr: 69, match_date: '2026-06-28T01:00:00Z' }, // Algeriet vs Osterrike      21:00 EDT   Arrowhead KC
  { match_nr: 70, match_date: '2026-06-28T01:00:00Z' }, // Jordanien vs Argentina     21:00 EDT   AT&T Stadium
  // GROUP K
  { match_nr: 23, match_date: '2026-06-17T16:00:00Z' }, // Portugal vs Kongo          12:00 EDT   NRG Houston
  { match_nr: 24, match_date: '2026-06-18T02:00:00Z' }, // Uzbekistan vs Colombia     20:00 UTC-6 Estadio Azteca
  { match_nr: 47, match_date: '2026-06-23T16:00:00Z' }, // Portugal vs Uzbekistan     12:00 EDT   NRG Houston
  { match_nr: 48, match_date: '2026-06-24T02:00:00Z' }, // Colombia vs Kongo          20:00 UTC-6 Estadio Akron
  { match_nr: 71, match_date: '2026-06-27T23:30:00Z' }, // Colombia vs Portugal       19:30 EDT   Hard Rock Miami
  { match_nr: 72, match_date: '2026-06-27T23:30:00Z' }, // Kongo vs Uzbekistan        19:30 EDT   Mercedes-Benz Atlanta
  // GROUP L
  { match_nr: 22, match_date: '2026-06-17T19:00:00Z' }, // England vs Kroatien        15:00 EDT   AT&T Stadium
  { match_nr: 21, match_date: '2026-06-17T23:00:00Z' }, // Ghana vs Panama            19:00 EDT   BMO Field
  { match_nr: 45, match_date: '2026-06-23T20:00:00Z' }, // England vs Ghana           16:00 EDT   Gillette
  { match_nr: 46, match_date: '2026-06-23T23:00:00Z' }, // Panama vs Kroatien         19:00 EDT   BMO Field
  { match_nr: 67, match_date: '2026-06-27T21:00:00Z' }, // Panama vs England          17:00 EDT   MetLife
  { match_nr: 68, match_date: '2026-06-27T21:00:00Z' }, // Kroatien vs Ghana          17:00 EDT   Lincoln Financial
];

async function run() {
  let updated = 0, failed = 0;
  for (const u of updates) {
    const { error } = await sb.from('matches').update({ match_date: u.match_date }).eq('match_nr', u.match_nr);
    if (error) { console.error('FAIL #' + u.match_nr, error.message); failed++; }
    else { process.stdout.write('.'); updated++; }
  }
  console.log('\nDone. Updated:', updated, 'Failed:', failed);
}
run();
