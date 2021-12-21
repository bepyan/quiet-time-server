import { CrawlerKey } from "../../services/CrawlerService";

declare module "@types" {
  /* ---------------- DTO ---------------- */
  interface UserDTO {
    name: string;
    notion_auth: string;
  }

  interface NotionDatabaseDTO {
    notion_auth: string;
    page_id: string;
  }

  interface NotionPageDTO {
    notion_auth: string;
    database_id: string;
    contentType: CrawlerKey;
  }

  interface SubscriptNotionDTO {
    name: string;
    notion: INotion;
  }

  /* ---------------- Model ---------------- */

  interface IUser {
    name: string;
    notion_auth: string;
    notions: INotion[];
    create_date?: Date;
  }

  interface INotion {
    database_id: string;
    contentType: CrawlerKey;
    create_date?: Date;
  }
}