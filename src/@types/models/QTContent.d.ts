declare module "@types" {
  interface IQTContent {
    contentType: ContentType;
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
    contentType: ContentType;
    date?: string;
  }
}
