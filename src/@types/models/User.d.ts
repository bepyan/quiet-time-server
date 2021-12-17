declare module "@types" {
  /* ---------------- DTO ---------------- */
  interface IUserDTO {
    name: string;
  }

  interface ISubscriptNotionDTO {
    name: string;
    notion: INotion;
  }

  /* ---------------- Model ---------------- */

  interface IUser {
    name: string;
    notions: INotion[];
    create_date?: Date;
  }

  interface INotion {
    key: string;
    database_id: string;
  }
}
