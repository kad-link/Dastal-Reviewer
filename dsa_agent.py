from notion_client import Client
import os
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage
import random

load_dotenv()

NOTION_CLIENT=os.getenv("SECRET_KEY")
DATABASE_ID=os.getenv("DATABASE_ID")
EMAIL_SENDER=os.getenv("MAIL_SENDER")
EMAIL_RECEIVER=os.getenv("MAIL_RECEIVER")
EMAIL_PASSWORD=os.getenv("MAIL_PASSWORD")

notion = Client(auth=NOTION_CLIENT)

def fetch_ten_problems():
    print("Connecting to NOTION...")
    selected_problems = []
    try:
        db_info = notion.databases.retrieve(DATABASE_ID)
        data_source_id = db_info["data_sources"][0]["id"]

        response = notion.data_sources.query(data_source_id=data_source_id)
        problems = response.get("results", [])


        if not problems:
            print("Successfully connected, but the database is empty...")
            return 
        print(f"Success connecting...Found {len(problems)} in the database")

        for pb in problems:
            title_property = pb["properties"]["Problem Title"]["title"]
            if title_property:
                title = title_property[0]["plain_text"]
                print(title)
                page_id = pb["id"]
                notes_property = pb["properties"].get("Notes", {})
                notes_content = notes_property.get("rich_text", [])
                try:
                    count = int(notes_content[0]["plain_text"]) if notes_content else 0
                except (ValueError, IndexError):
                    count = 0

                selected_problems.append({
                "title": title,
                "page_id": page_id,
                "count": count
            })

        return selected_problems
            
    except Exception as e:
        print(f"Server problem : {e}")

def pick_problems(all_problems: list, n: int = 3) -> list:
    min_count = min(p["count"] for p in all_problems)
    eligible = [p for p in all_problems if p["count"] == min_count]
    random.shuffle(eligible)

    if len(eligible) < n:
        rest = sorted(
            [p for p in all_problems if p["count"] > min_count],
            key=lambda x: x["count"]
        )
        eligible += rest

    return eligible[:n]


def update_notion_counts(chosen: list):
    print("Updating Notion counts...")
    for problem in chosen:
        new_count = problem["count"] + 1
        try:
            notion.pages.update(
                page_id=problem["page_id"],
                properties={
                    "Notes": {
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {"content": str(new_count)}
                            }
                        ]
                    }
                }
            )
            print(f"  Updated '{problem['title']}': {problem['count']} → {new_count}")
        except Exception as e:
            print(f"  Failed to update '{problem['title']}': {e}")


def send_mail(problems):
    print(f"Mailing myself...")

    msg = EmailMessage()
    msg["Subject"] = "Daily DSA revision"
    msg['From'] = EMAIL_SENDER
    msg['To'] = EMAIL_RECEIVER

    final_problems = "\n".join([f"- {pb['title']}" for pb in problems])

    body = f"""Hi. The following are the questions for today:\n\n{final_problems}\n\nEnjoy."""
    msg.set_content(body)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
            smtp.send_message(msg)
        print("Mailed successfully")
    except Exception as e:
        print(f"Failed mailing...{e}")

def main():
    problems= fetch_ten_problems()
    
    if not problems:
        print("No problems found to review.")
        return

    

    todays_problems = pick_problems(problems, n=4)
    print("Today's problems:")
    for p in todays_problems:
        print(f"  - {p['title']} (sent {p['count']} times before)")
    update_notion_counts(todays_problems)
    send_mail(todays_problems)


if __name__ == "__main__":
    main()


