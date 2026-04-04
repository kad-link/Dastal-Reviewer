
const NOTION_API = "https://api.notion.com/v1";
const HEADERS = {
  "Authorization": `Bearer ${process.env.NOTION_SECRET_KEY}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};
const DB_ID = process.env.NOTION_DATABASE_ID;

export default async function handler(req, res) {
  try {
    switch (req.method) {
      // 🟢 READ: Fetch all problems
      case "GET": {
        const response = await fetch(`${NOTION_API}/databases/${DB_ID}/query`, {
          method: "POST",
          headers: HEADERS,
        });
        const data = await response.json();
        
        // Transform Notion's complex JSON into your frontend's flat row structure
        const rows = data.results.map((page) => ({
          id: page.id,
          title: page.properties["Problem Title"]?.title[0]?.plain_text || "",
          topic: page.properties["Topic"]?.select?.name || "",
          url: page.properties["URL"]?.url || "",
          notes: page.properties["Notes"]?.rich_text[0]?.plain_text || "",
        }));
        
        return res.status(200).json(rows);
      }

      // 🔵 CREATE: Add a new blank row
      case "POST": {
        const response = await fetch(`${NOTION_API}/pages`, {
          method: "POST",
          headers: HEADERS,
          body: JSON.stringify({
            parent: { database_id: DB_ID },
            properties: {
              "Problem Title": { title: [{ text: { content: "" } }] },
            },
          }),
        });
        const data = await response.json();
        return res.status(200).json({ id: data.id });
      }

      // 🔴 DELETE: Archive the row in Notion
      case "DELETE": {
        const { id } = req.body;
        await fetch(`${NOTION_API}/pages/${id}`, {
          method: "PATCH",
          headers: HEADERS,
          body: JSON.stringify({ archived: true }), // Notion deletes via archiving
        });
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}