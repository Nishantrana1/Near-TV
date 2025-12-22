# 🌍 Near TV – Web-based IPTV Player

Near TV is a **web-based IPTV streaming application** built using **HTML, CSS, and JavaScript**.  
It uses the **public IPTV-ORG API** to fetch and stream publicly available TV channels directly in the browser.

The project focuses on **clean UI, smooth UX, and responsive design**, similar to real IPTV and music streaming apps.

---

## ✨ Features

- 📺 Stream live IPTV channels in browser
- 🔍 Search channels by name
- 🌍 Filter channels by country
- 🎵 Filter channels by category (Music, News, Sports, etc.)
- 🇮🇳 Default selection: **India + Music**
- ▶️ Auto-play channel on click (no need to press play)
- 🎯 Highlight currently playing channel
- 🖱️ Hand cursor on hover (no text cursor)
- 📜 Scrollable channel list (player stays fixed)
- 📱 Fully responsive (desktop & mobile friendly)

---

## 🛠 Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **HLS.js** (for streaming `.m3u8` HLS streams)
- **IPTV-ORG Public API**
- **Netlify** (for deployment)

---

## 🔗 Live Demo

👉 **Live Website:**  
https://neartv.netlify.app/

---

## 📡 Data Source

This project uses publicly available data from:

- https://github.com/iptv-org/iptv
- https://iptv-org.github.io/api/

The app **does not host any video content**.  
It only indexes and plays publicly accessible streams.

---

## 📁 Project Structure

```text
Near-TV/
│
├── index.html
├── style.css
├── script.js
├── favicon.ico
└── README.md
