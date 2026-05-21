export interface Match {
  match_nr: number;
  date: string;
  group: string;
  home_team: string;
  away_team: string;
}

export const matches: Match[] = [
  { match_nr: 1, date: "2026-06-11", group: "A", home_team: "Mexiko", away_team: "Sydafrika" },
  { match_nr: 2, date: "2026-06-12", group: "A", home_team: "Sydkorea", away_team: "Czechia" },
  { match_nr: 25, date: "2026-06-18", group: "A", home_team: "Czechia", away_team: "Sydafrika" },
  { match_nr: 28, date: "2026-06-19", group: "A", home_team: "Mexiko", away_team: "Sydkorea" },
  { match_nr: 53, date: "2026-06-25", group: "A", home_team: "Czechia", away_team: "Mexiko" },
  { match_nr: 54, date: "2026-06-25", group: "A", home_team: "Sydafrika", away_team: "Sydkorea" },
  { match_nr: 3, date: "2026-06-12", group: "B", home_team: "Kanada", away_team: "Bosnien-Hercegovina" },
  { match_nr: 8, date: "2026-06-13", group: "B", home_team: "Qatar", away_team: "Schweiz" },
  { match_nr: 26, date: "2026-06-18", group: "B", home_team: "Schweiz", away_team: "Bosnien-Hercegovina" },
  { match_nr: 27, date: "2026-06-19", group: "B", home_team: "Kanada", away_team: "Qatar" },
  { match_nr: 51, date: "2026-06-24", group: "B", home_team: "Schweiz", away_team: "Kanada" },
  { match_nr: 52, date: "2026-06-24", group: "B", home_team: "Bosnien-Hercegovina", away_team: "Qatar" },
  { match_nr: 7, date: "2026-06-14", group: "C", home_team: "Brasilien", away_team: "Marocko" },
  { match_nr: 5, date: "2026-06-14", group: "C", home_team: "Haiti", away_team: "Skottland" },
  { match_nr: 30, date: "2026-06-20", group: "C", home_team: "Skottland", away_team: "Marocko" },
  { match_nr: 29, date: "2026-06-20", group: "C", home_team: "Brasilien", away_team: "Haiti" },
  { match_nr: 49, date: "2026-06-25", group: "C", home_team: "Skottland", away_team: "Brasilien" },
  { match_nr: 50, date: "2026-06-25", group: "C", home_team: "Marocko", away_team: "Haiti" },
  { match_nr: 4, date: "2026-06-13", group: "D", home_team: "USA", away_team: "Paraguay" },
  { match_nr: 6, date: "2026-06-14", group: "D", home_team: "Australien", away_team: "Turkiet" },
  { match_nr: 32, date: "2026-06-19", group: "D", home_team: "USA", away_team: "Australien" },
  { match_nr: 31, date: "2026-06-20", group: "D", home_team: "Turkiet", away_team: "Paraguay" },
  { match_nr: 59, date: "2026-06-26", group: "D", home_team: "Turkiet", away_team: "USA" },
  { match_nr: 60, date: "2026-06-26", group: "D", home_team: "Paraguay", away_team: "Australien" },
  { match_nr: 10, date: "2026-06-14", group: "E", home_team: "Tyskland", away_team: "Curaçao" },
  { match_nr: 9, date: "2026-06-15", group: "E", home_team: "Elfenbenskusten", away_team: "Ecuador" },
  { match_nr: 33, date: "2026-06-20", group: "E", home_team: "Tyskland", away_team: "Elfenbenskusten" },
  { match_nr: 34, date: "2026-06-21", group: "E", home_team: "Ecuador", away_team: "Curaçao" },
  { match_nr: 55, date: "2026-06-25", group: "E", home_team: "Curaçao", away_team: "Elfenbenskusten" },
  { match_nr: 56, date: "2026-06-25", group: "E", home_team: "Ecuador", away_team: "Tyskland" },
  { match_nr: 11, date: "2026-06-14", group: "F", home_team: "Nederländerna", away_team: "Japan" },
  { match_nr: 12, date: "2026-06-15", group: "F", home_team: "Sverige", away_team: "Tunisien" },
  { match_nr: 35, date: "2026-06-20", group: "F", home_team: "Nederländerna", away_team: "Sverige" },
  { match_nr: 36, date: "2026-06-21", group: "F", home_team: "Tunisien", away_team: "Japan" },
  { match_nr: 57, date: "2026-06-26", group: "F", home_team: "Japan", away_team: "Sverige" },
  { match_nr: 58, date: "2026-06-26", group: "F", home_team: "Tunisien", away_team: "Nederländerna" },
  { match_nr: 16, date: "2026-06-15", group: "G", home_team: "Belgien", away_team: "Egypten" },
  { match_nr: 15, date: "2026-06-16", group: "G", home_team: "Iran", away_team: "Nya Zeeland" },
  { match_nr: 39, date: "2026-06-21", group: "G", home_team: "Belgien", away_team: "Iran" },
  { match_nr: 40, date: "2026-06-22", group: "G", home_team: "Nya Zeeland", away_team: "Egypten" },
  { match_nr: 63, date: "2026-06-27", group: "G", home_team: "Egypten", away_team: "Iran" },
  { match_nr: 64, date: "2026-06-27", group: "G", home_team: "Nya Zeeland", away_team: "Belgien" },
  { match_nr: 14, date: "2026-06-15", group: "H", home_team: "Spanien", away_team: "Kap Verde" },
  { match_nr: 13, date: "2026-06-16", group: "H", home_team: "Saudiarabien", away_team: "Uruguay" },
  { match_nr: 38, date: "2026-06-21", group: "H", home_team: "Spanien", away_team: "Saudiarabien" },
  { match_nr: 37, date: "2026-06-22", group: "H", home_team: "Uruguay", away_team: "Kap Verde" },
  { match_nr: 65, date: "2026-06-27", group: "H", home_team: "Kap Verde", away_team: "Saudiarabien" },
  { match_nr: 66, date: "2026-06-27", group: "H", home_team: "Uruguay", away_team: "Spanien" },
  { match_nr: 17, date: "2026-06-16", group: "I", home_team: "Frankrike", away_team: "Senegal" },
  { match_nr: 18, date: "2026-06-17", group: "I", home_team: "Irak", away_team: "Norge" },
  { match_nr: 42, date: "2026-06-22", group: "I", home_team: "Frankrike", away_team: "Irak" },
  { match_nr: 41, date: "2026-06-23", group: "I", home_team: "Norge", away_team: "Senegal" },
  { match_nr: 61, date: "2026-06-26", group: "I", home_team: "Norge", away_team: "Frankrike" },
  { match_nr: 62, date: "2026-06-26", group: "I", home_team: "Senegal", away_team: "Irak" },
  { match_nr: 19, date: "2026-06-17", group: "J", home_team: "Argentina", away_team: "Algeriet" },
  { match_nr: 20, date: "2026-06-17", group: "J", home_team: "Österrike", away_team: "Jordanien" },
  { match_nr: 43, date: "2026-06-22", group: "J", home_team: "Argentina", away_team: "Österrike" },
  { match_nr: 44, date: "2026-06-23", group: "J", home_team: "Jordanien", away_team: "Algeriet" },
  { match_nr: 69, date: "2026-06-28", group: "J", home_team: "Algeriet", away_team: "Österrike" },
  { match_nr: 70, date: "2026-06-28", group: "J", home_team: "Jordanien", away_team: "Argentina" },
  { match_nr: 23, date: "2026-06-17", group: "K", home_team: "Portugal", away_team: "Kongo" },
  { match_nr: 24, date: "2026-06-18", group: "K", home_team: "Uzbekistan", away_team: "Colombia" },
  { match_nr: 47, date: "2026-06-23", group: "K", home_team: "Portugal", away_team: "Uzbekistan" },
  { match_nr: 48, date: "2026-06-24", group: "K", home_team: "Colombia", away_team: "Kongo" },
  { match_nr: 71, date: "2026-06-28", group: "K", home_team: "Colombia", away_team: "Portugal" },
  { match_nr: 72, date: "2026-06-28", group: "K", home_team: "Kongo", away_team: "Uzbekistan" },
  { match_nr: 22, date: "2026-06-17", group: "L", home_team: "England", away_team: "Kroatien" },
  { match_nr: 21, date: "2026-06-18", group: "L", home_team: "Ghana", away_team: "Panama" },
  { match_nr: 45, date: "2026-06-23", group: "L", home_team: "England", away_team: "Ghana" },
  { match_nr: 46, date: "2026-06-24", group: "L", home_team: "Panama", away_team: "Kroatien" },
  { match_nr: 67, date: "2026-06-27", group: "L", home_team: "Panama", away_team: "England" },
  { match_nr: 68, date: "2026-06-27", group: "L", home_team: "Kroatien", away_team: "Ghana" },
];

export const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

export type BonusQuestionKey =
  | "top_scorer"
  | "champion"
  | "bronze_winner"
  | "most_goals_group"
  | "most_conceded_group";

export interface BonusQuestion {
  key: BonusQuestionKey;
  points: number;
}

export const bonusQuestions: BonusQuestion[] = [
  { key: "top_scorer", points: 20 },
  { key: "champion", points: 20 },
  { key: "bronze_winner", points: 20 },
  { key: "most_goals_group", points: 10 },
  { key: "most_conceded_group", points: 10 },
];

export const TOURNAMENT_START = new Date("2026-06-11T22:00:00Z"); // 00:00 Swedish CEST / 21:00 Mexico CDT
export const DEADLINE = TOURNAMENT_START; // Tips must be submitted before this
export const TOURNAMENT_END = new Date("2026-07-11");
export const INVITE_CODE = "GMAB2026";
export const ENTRY_FEE_SEK = 50;
