"""
Генерация placeholder-изображений для seed-данных.
Создаёт SVG-файлы в папке uploads.
"""
import os

UPLOAD_DIR = "./uploads"


def ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)


def _svg_gradient(w: int, h: int, color1: str, color2: str, text: str, text_size: int = 32) -> str:
    """Generate an SVG with gradient background and centered text."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{color1};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:{color2};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="url(#g)"/>
  <text x="{w//2}" y="{h//2}" font-family="Arial,sans-serif" font-size="{text_size}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central" opacity="0.9">{text}</text>
</svg>'''


def _svg_avatar(color1: str, color2: str, initials: str) -> str:
    """Generate a round avatar SVG."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{color1}"/>
      <stop offset="100%" style="stop-color:{color2}"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#g)"/>
  <text x="100" y="100" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">{initials}</text>
</svg>'''


def _save(name: str, content: str) -> str:
    """Save SVG content to file and return API URL."""
    filepath = os.path.join(UPLOAD_DIR, name)
    with open(filepath, "w") as f:
        f.write(content)
    return f"/api/v1/uploads/{name}"


def generate_all_images() -> dict:
    """Generate all seed images and return a dict of name -> URL."""
    ensure_upload_dir()
    urls = {}

    # === DIRECTION COVERS (800x400) ===
    directions = {
        "cybersport": ("#6C5CE7", "#8B5CF6", "КИБЕРСПОРТ"),
        "lasertag": ("#FF6B6B", "#EE5A24", "ЛАЗЕРТАГ"),
        "drones": ("#00D2D3", "#0984E3", "ДРОНЫ"),
        "playstation": ("#FECA57", "#FF9F43", "PLAYSTATION"),
        "computers": ("#00B894", "#55E6C1", "КОМПЬЮТЕРЫ"),
    }
    for slug, (c1, c2, label) in directions.items():
        svg = _svg_gradient(800, 400, c1, c2, label, 48)
        urls[f"dir_{slug}"] = _save(f"dir_{slug}.svg", svg)

    # === NEWS COVERS (800x400) ===
    news_items = {
        "cifra-launch": ("#2563EB", "#6C5CE7", "CIFRA"),
        "cs2-cup": ("#FF6B6B", "#6C5CE7", "CS2 CUP"),
        "fpv-goggles": ("#00D2D3", "#0984E3", "FPV"),
        "fifa25": ("#FECA57", "#FF9F43", "FIFA 25"),
        "holiday": ("#636E72", "#2D3436", "ГРАФИК"),
        "dota2": ("#6C5CE7", "#E84393", "DOTA 2"),
        "vr-day": ("#A29BFE", "#6C5CE7", "VR DAY"),
        "cs2-league": ("#FF6B6B", "#2D3436", "CS2 ЛИГА"),
        "drone-day": ("#00D2D3", "#00B894", "ДРОНЫ"),
        "lasertag-battle": ("#FF6B6B", "#EE5A24", "ЛАЗЕРТАГ"),
        "weekly-top": ("#FECA57", "#F368E0", "ТОП НЕДЕЛИ"),
        "dksh-mentor": ("#00B894", "#0984E3", "ДКШ"),
    }
    for slug, (c1, c2, label) in news_items.items():
        svg = _svg_gradient(800, 400, c1, c2, label, 44)
        urls[f"news_{slug}"] = _save(f"news_{slug}.svg", svg)

    # === REWARD PHOTOS (400x300) ===
    reward_items = {
        "tshirt": ("#2D3436", "#636E72", "ФУТБОЛКА"),
        "stickers": ("#6C5CE7", "#A29BFE", "СТИКЕРЫ"),
        "powerbank": ("#0984E3", "#00D2D3", "POWERBANK"),
        "mousepad": ("#2D3436", "#6C5CE7", "КОВРИК"),
        "mug": ("#E17055", "#FECA57", "КРУЖКА"),
        "hoodie": ("#2D3436", "#6C5CE7", "ХУДИ"),
        "lanyard": ("#636E72", "#2D3436", "ЛАНЪЯРД"),
    }
    for slug, (c1, c2, label) in reward_items.items():
        svg = _svg_gradient(400, 300, c1, c2, label, 36)
        urls[f"reward_{slug}"] = _save(f"reward_{slug}.svg", svg)

    # === AVATARS (200x200) ===
    avatar_items = {
        "admin": ("#6C5CE7", "#A29BFE", "АП"),
        "trainer1": ("#0984E3", "#00D2D3", "СИ"),
        "trainer2": ("#E84393", "#FD79A8", "ОК"),
        "student1": ("#FF6B6B", "#EE5A24", "ИИ"),
        "student2": ("#F368E0", "#A29BFE", "МП"),
        "student3": ("#6C5CE7", "#0984E3", "АС"),
        "student4": ("#00B894", "#55E6C1", "ЕК"),
        "student5": ("#00D2D3", "#0984E3", "ДМ"),
        "student6": ("#FECA57", "#FF9F43", "АН"),
        "student7": ("#FF6B6B", "#6C5CE7", "НВ"),
        "student8": ("#E84393", "#FF6B6B", "ОС"),
    }
    for key, (c1, c2, initials) in avatar_items.items():
        svg = _svg_avatar(c1, c2, initials)
        urls[f"avatar_{key}"] = _save(f"avatar_{key}.svg", svg)

    return urls
