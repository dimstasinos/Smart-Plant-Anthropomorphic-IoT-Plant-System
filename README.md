# 🌿 Smart Plant — Anthropomorphic IoT Plant System

**Diploma Thesis** | Department of Computer Engineering & Informatics | University of Patras  
**Author:** Dimitrios Stasinos  
**Title:** *Interaction with Anthropomorphic Objects of the Natural Environment*

---

## Overview

Smart Plant is an IoT system that attaches an LLM-powered anthropomorphic personality to a living Monstera Deliciosa plant. The plant monitors its own environmental conditions (soil moisture, light, temperature, humidity) and communicates with nearby users through natural language, GIFs, and emojis — expressing one of three distinct personalities: **Happy 😊**, **Angry 😤**, or **Sad 😢**.

The goal is to encourage plant care engagement by making the plant feel like a social agent rather than a passive object.

---

## System Architecture

```
Raspberry Pi 4B
 ├── Sensors: DHT22 (temp/humidity), SEN0193 (soil moisture), VEML7700 (light)
 ├── Display: Screen showing GIFs + text
 └── Communicates with Flask/Socket.IO server

Flask Server
 ├── Gemini API → LLM-generated personality responses
 ├── Google Firestore → conversation & sensor data storage
 └── Web chat interface for users

Analysis Scripts
 ├── Sensor & interaction data processing
 ├── NMF topic modeling on chat messages
 └── Logistic Regression personality classifier
```

---

## Repository Structure

```
smart-plant/
│
├── raspberry_pi.py              # Sensor reading & communication with server
├── plantScreen.py               # Display controller (GIFs, text, emoji on screen)
├── expressions_path.py          # GIF/expression path mappings per mood state
├── tools.py                     # Utility functions (e.g. sunrise/sunset detection)
│
├── server.py                    # Flask + Socket.IO server, Gemini API integration
│
├── prompts/
│   ├── llm_prompt.txt           # Base LLM system prompt (role, rules, plant info)
│   ├── happy.txt                # Happy personality prompt
│   ├── angry.txt                # Angry personality prompt
│   └── sad.txt                  # Sad personality prompt
│
├── config/
│   ├── plant_thresholds.json    # Sensor threshold values for plant needs
│   └── need_keys.json           # Need state tracking template
│
├── templates/
│   ├── flower.html              # Main chat interface
│   ├── wait.html                # Waiting page (another user is active)
│   ├── inactivity.html          # Inactivity logout page
│   └── exit.html                # Logout confirmation page
│
├── static/
│   ├── flower_page_script.js    # Main chat page logic
│   ├── flower_page_style.css    # Main chat page styles
│   ├── user_check.js            # User session check on page load
│   ├── wait_script.js           # Wait page logic
│   ├── wait_style.css           # Wait page styles
│   ├── inactivity_script.js     # Inactivity page logic
│   ├── inactivity_style.css     # Inactivity page styles
│   ├── exit_style.css           # Exit page styles
│   ├── favicon-32x32.png        # Site favicon
│   └── expressions/             # GIF/PNG emoji expressions (not included in repo)
│
└── thesis/
    └── diploma_thesis_DimitriosStasinos.pdf
```

---

## Personalities

Each user is assigned one of three personalities on first login, which remains stable across sessions. The personality defines the **communication style** of the plant, not its emotional state.

| Personality | Communication Style |
|-------------|---------------------|
| 😊 Happy    | Friendly, warm, polite — asks for things gently |
| 😤 Angry    | Grumpy, ironic, demanding, sarcastic |
| 😢 Sad      | Melancholic, emotional tone |

Independently of personality, the plant's **visual expression** (GIFs/emojis) changes based on a **mood score** calculated from real-time sensor readings:

| Mood Score | State    | Visual |
|------------|----------|--------|
| 0          | Good     | Personality-specific expression |
| 1          | Neutral  | Neutral emoji |
| 2–3        | Sad      | Sad emojis |
| ≥4         | Critical | Crying emojis |

---

## Hardware

- Raspberry Pi 4B
- IO Expansion HAT
- DHT22 — Temperature & Humidity sensor
- SEN0193 — Capacitive soil moisture sensor
- VEML7700 — Ambient light sensor
- Display screen

---

## Evaluation

The system was evaluated in two phases:
- **Phase 1:** Public space (university cafeteria) — 2 months, larger user group
- **Phase 2:** Workplace setting (retail store) — 2 weeks, smaller group near register

Phase 2 showed significantly higher engagement and improved plant care response rates compared to Phase 1.

---

## Tech Stack

- **Hardware:** Raspberry Pi 4B
- **Backend:** Flask, Socket.IO
- **LLM:** Google Gemini API
- **Database:** Google Firestore
- **Analysis:** scikit-learn (NMF, Logistic Regression), pandas, ANOVA


