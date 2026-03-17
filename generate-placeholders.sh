#!/bin/bash
# Генерация SVG-заглушек для всех изображений проекта
# После генерации заменить .svg файлы на реальные .jpg/.png

DIR="frontend/public/images"

# Функция для создания SVG-заглушки
create_svg() {
  local file="$1" w="$2" h="$3" c1="$4" c2="$5" text="$6" size="${7:-36}"
  cat > "$file" << SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="$w" height="$h" viewBox="0 0 $w $h">
<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:$c1"/><stop offset="100%" style="stop-color:$c2"/></linearGradient></defs>
<rect width="$w" height="$h" fill="url(#g)"/>
<text x="$((w/2))" y="$((h/2))" font-family="Arial,sans-serif" font-size="$size" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central" opacity="0.85">$text</text>
</svg>
SVGEOF
}

# === НАПРАВЛЕНИЯ (800x400) ===
create_svg "$DIR/directions/cybersport.svg" 800 400 "#6C5CE7" "#8B5CF6" "КИБЕРСПОРТ" 48
create_svg "$DIR/directions/lasertag.svg" 800 400 "#FF6B6B" "#EE5A24" "ЛАЗЕРТАГ" 48
create_svg "$DIR/directions/drones.svg" 800 400 "#00D2D3" "#0984E3" "ДРОНЫ" 48
create_svg "$DIR/directions/playstation.svg" 800 400 "#FECA57" "#FF9F43" "PLAYSTATION" 48
create_svg "$DIR/directions/computers.svg" 800 400 "#00B894" "#55E6C1" "КОМПЬЮТЕРЫ" 48

# === НОВОСТИ (800x400) ===
create_svg "$DIR/news/cifra-launch.svg" 800 400 "#2563EB" "#6C5CE7" "CIFRA ЗАПУСК" 44
create_svg "$DIR/news/cs2-cup.svg" 800 400 "#FF6B6B" "#6C5CE7" "CS2 КУБОК" 44
create_svg "$DIR/news/fpv-goggles.svg" 800 400 "#00D2D3" "#0984E3" "FPV ШЛЕМЫ" 44
create_svg "$DIR/news/fifa25.svg" 800 400 "#FECA57" "#FF9F43" "FIFA 25" 44
create_svg "$DIR/news/holiday.svg" 800 400 "#636E72" "#2D3436" "ГРАФИК" 44
create_svg "$DIR/news/dota2.svg" 800 400 "#6C5CE7" "#E84393" "DOTA 2" 44
create_svg "$DIR/news/vr-day.svg" 800 400 "#A29BFE" "#6C5CE7" "VR DAY" 44
create_svg "$DIR/news/cs2-league.svg" 800 400 "#FF6B6B" "#2D3436" "CS2 ЛИГА" 44
create_svg "$DIR/news/drone-day.svg" 800 400 "#00D2D3" "#00B894" "ДЕНЬ ДРОНОВ" 44
create_svg "$DIR/news/lasertag-battle.svg" 800 400 "#FF6B6B" "#EE5A24" "БИТВА" 44
create_svg "$DIR/news/weekly-top.svg" 800 400 "#FECA57" "#F368E0" "ТОП НЕДЕЛИ" 44
create_svg "$DIR/news/dksh-mentor.svg" 800 400 "#00B894" "#0984E3" "ДКШ" 44

# === НАГРАДЫ (400x300) ===
create_svg "$DIR/rewards/tshirt.svg" 400 300 "#2D3436" "#636E72" "ФУТБОЛКА" 32
create_svg "$DIR/rewards/stickers.svg" 400 300 "#6C5CE7" "#A29BFE" "СТИКЕРЫ" 32
create_svg "$DIR/rewards/powerbank.svg" 400 300 "#0984E3" "#00D2D3" "POWERBANK" 32
create_svg "$DIR/rewards/mousepad.svg" 400 300 "#2D3436" "#6C5CE7" "КОВРИК" 32
create_svg "$DIR/rewards/mug.svg" 400 300 "#E17055" "#FECA57" "КРУЖКА" 32
create_svg "$DIR/rewards/hoodie.svg" 400 300 "#2D3436" "#6C5CE7" "ХУДИ" 32
create_svg "$DIR/rewards/lanyard.svg" 400 300 "#636E72" "#2D3436" "ЛАНЪЯРД" 32

# === ЛОГОТИП ===
create_svg "$DIR/logo.svg" 200 200 "#2563EB" "#6C5CE7" "C" 80

echo "Все заглушки созданы!"
echo ""
echo "=== КАК ЗАМЕНИТЬ НА РЕАЛЬНЫЕ ФОТО ==="
echo "1. Подготовь фото в формате .jpg или .png"
echo "2. Положи в нужную папку с тем же именем (расширение можно менять)"
echo "3. Удали старый .svg файл"
echo "4. Пример: заменить cybersport.svg на cybersport.jpg"
echo ""
echo "Папки:"
echo "  $DIR/directions/  — обложки направлений (800x400px)"
echo "  $DIR/news/        — обложки новостей (800x400px)"
echo "  $DIR/rewards/     — фото наград (400x300px)"
echo "  $DIR/logo.svg     — логотип (200x200px)"
