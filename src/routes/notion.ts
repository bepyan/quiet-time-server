import express from "express";
import { Client } from "@notionhq/client";

const router = express.Router();

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const addItem = async (text: string) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId! },
      properties: {
        title: {
          title: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
      },
    });
    console.log(response);
    console.log("Success! Entry added.");
  } catch (error: any) {
    console.error(error.body);
  }
};

router.get("/", async (req, res, next) => {
  addItem("테스트");
});

export default router;
