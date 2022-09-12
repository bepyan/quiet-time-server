declare module '@types' {
  interface IQTContent {
    contentType: ContentType;
    title: string;
    date: string;
    range: {
      text: string;
      book: string;
      start: { capter: number; verse: number };
      end: { caper: number; verse: number };
    };
    verses: IVerse[];
    commentaries: string[];
  }

  interface IVerse {
    capter?: number;
    verse?: number;
    text: string;
  }

  interface SearchQTContentDTO {
    contentType: ContentType;
    date?: string;
  }
}
