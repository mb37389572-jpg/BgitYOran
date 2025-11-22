
export interface Team {
  name: string;
  logoUrl: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  time: string;
  odds: {
    ms1: string;
    msx: string;
    ms2: string;
  };
}

export interface CardConfig {
  title?: string; 
  subtitle?: string;
  date: string; 
  footerText1: string;
  footerText2: string;
  footerText3: string;
}
