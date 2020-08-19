export interface IMatch {
  tournamentId: string;
  replayId: string;
  blue: {
    name: string;
    goals: number;
  };
  orange: {
    name: string;
    goals: number;
  };
}
