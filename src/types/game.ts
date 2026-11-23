export interface IGDBImage {
  id: number;
  url: string;
}

export interface IGDBTag {
  id: number;
  name: string;
}

export interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  rating?: number;
  first_release_date?: number;
  cover?: IGDBImage;
  genres?: IGDBTag[];
  platforms?: IGDBTag[];
  screenshots?: IGDBImage[];
}
