declare module "@types" {
  interface IQTContent {
    type: string;
    title: string;
    date: string;
    range: string;
    verses: IVerse[];
    commentaries: string[];
  }

  interface IVerse {
    verse?: number;
    text: string;
  }

  interface SearchQTContentDTO {
    type: string;
    date: string;
  }
}
