#!/usr/bin/env bash
# Kompilasi CSS Tailwind (v4) → assets/css/app.css
set -e
CLI="$HOME/.cache/tw-cli"
if [ ! -x "$CLI" ]; then
  echo "Mengunduh Tailwind CLI…"
  curl -sL -o "$CLI" https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-x64
  chmod +x "$CLI"
fi
"$CLI" -i src/input.css -o assets/css/app.css --minify
echo "Selesai → assets/css/app.css"
