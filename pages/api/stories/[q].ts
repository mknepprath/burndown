import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const {
    query: { q },
  } = req;
  try {
    const response = await fetch(
      `https://api.app.shortcut.com/api/v3/search/stories?page_size=25&query=${q}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Shortcut-Token": process.env.NEXT_PUBLIC_SHORTCUT_API_TOKEN || "",
        },
      }
    );
    const stories = await response.json();
    res.status(200).json(stories.data);
  } catch (e) {
    console.log(e);
  }
}
