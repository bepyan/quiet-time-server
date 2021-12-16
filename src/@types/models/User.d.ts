declare module "@types" {
  interface QTContent {
    title: string;
    date: string;
    range: string;
    verses: Verse[];
    commentaries: string[];
  }

  interface Verse {
    verse?: number;
    text: string;
  }
}
