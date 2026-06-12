import json
import re

def parse_raw_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    questions = []
    current_section = "government"
    section_map = {
        "AMERICAN GOVERNMENT": "government",
        "RIGHTS AND RESPONSIBILITIES": "rights",
        "AMERICAN HISTORY": "history",
        "SYMBOLS AND HOLIDAYS": "symbols"
    }

    current_item = None

    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Section Header detection
        for name, key in section_map.items():
            if name in line:
                current_section = key
                break

        # Question detection: "1. What is..."
        match_q = re.match(r'^(\d+)\.\s+(.*)', line)
        if match_q:
            if current_item:
                questions.append(current_item)
            
            num = int(match_q.group(1))
            text = match_q.group(2).strip()
            
            # Determine type: personal_info if it mentions "your state", "your representative", etc.
            is_personal = any(x in text.lower() for x in ["your state", "your representative", "your district", "answers will vary"])
            
            current_item = {
                "id": f"{current_section}_{num}",
                "text": text,
                "type": 'personal_info' if is_personal else 'standard',
                "answer": "",
                "wikiLink": ""
            }
            continue

        # Answer detection: lines starting with bullet points
        if line.startswith('•') and current_item:
            answer_text = line.lstrip('•').strip()
            # Only store the first answer if empty (simplification for the app)
            if not current_item["answer"]:
                current_item["answer"] = answer_text

    if current_item:
        questions.append(current_item)

    # Structuring the final output
    structured_data = {
        "government": {"id": "government", "title": "Government", "questions": [], "masteredCount": 0},
        "rights": {"id": "rights", "title": "Rights & Responsibilities", "questions": [], "masteredCount": 0},
        "history": {"id": "history", "title": "American History", "questions": [], "masteredCount": 0},
        "symbols": {"id": "symbols", "title": "Symbols & Holidays", "questions": [], "masteredCount": 0}
    }

    # Simple Wikipedia link mapping for common key terms
    wiki_keywords = {
        "Constitution": "https://en.wikipedia.org/wiki/Constitution_of_the_United_States",
        "Declaration of Independence": "https://en.wikipedia.org/wiki/United_States_Declaration_of_Independence",
        "Bill of Rights": "https://en.wikipedia.org/wiki/United_States_Bill_of_Rights",
        "Capitalism": "https://en.wikipedia.org/wiki/Capitalism",
        "Electoral College": "https://en.wikipedia.org/wiki/United_States_Electoral_College",
        "Supreme Court": "https://en.wikipedia.org/wiki/Supreme_Court_of_the_United_States",
        "Civil War": "https://en.wikipedia.org/wiki/American_Civil_War",
        "Cold War": "https://en.wikipedia.org/wiki/Cold_War",
        "Statue of Liberty": "https://en.wikipedia.org/wiki/Statue_of_Liberty",
    }

    for q in questions:
        sec_key = q["id"].split('_')[0]
        if sec_key in structured_data:
            # Auto-generate wiki link if keyword matches
            for keyword, url in wiki_keywords.items():
                if keyword.lower() in q["text"].lower():
                    q["wikiLink"] = url
                    break
            structured_data[sec_key]["questions"].append(q)

    return structured_data

if __name__ == "__main__":
    result = parse_raw_data('data/raw_questions.txt')
    with open('src/lib/content.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
    print("Successfully exported 128 questions WITH answers to src/lib/content.json")
