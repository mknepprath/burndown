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
          "Shortcut-Token": "5a1f1708-0f86-4a18-9097-1928bfbd535c",
        },
      }
    );
    const stories = await response.json();
    res.status(200).json(stories.data);
  } catch (e) {
    console.log(e);
  }
}
