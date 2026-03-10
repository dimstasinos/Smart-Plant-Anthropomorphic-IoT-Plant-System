Smart Plant — Anthropomorphic IoT Plant System
Diploma Thesis | Department of Computer Engineering & Informatics | University of Patras
Author: Dimitrios Stasinos
Title: Interaction with Anthropomorphic Objects of the Natural Environment

Overview
Smart Plant is an IoT system that attaches an LLM-powered anthropomorphic personality to a living Monstera Deliciosa plant. The plant monitors its own environmental conditions (soil moisture, light, temperature, humidity) and communicates with nearby users through natural language, GIFs, and emojis — expressing one of three distinct personalities: Happy 😊, Angry 😤, or Sad 😢.
The goal is to encourage plant care engagement by making the plant feel like a social agent rather than a passive object.

System Architecture
Raspberry Pi 4B
 ├── Sensors: DHT22 (temp/humidity), SEN0193 (soil moisture), VEML7700 (light)
 ├── Display: Screen showing GIFs + text via plantScreen_v3.py
 └── Communicates with Flask/Socket.IO server

Flask Server (server_v6.py)
 ├── Gemini API → LLM-generated personality responses
 ├── Google Firestore → conversation & sensor data storage
 └── Web chat interface for users

Analysis Scripts
 ├── Sensor & interaction data processing
 ├── NMF topic modeling on chat messages
 └── Logistic Regression personality classifier

Repository Structure
├── raspberry_pi_v5.py         # Sensor reading & server communication
├── server_v6.py               # Flask + Socket.IO server, Gemini API integration
├── plantScreen_v3.py          # Display controller (GIFs, text, emoji)
├── expressions_path.py        # GIF/expression path mappings per personality
├── nmf.py                     # NMF topic modeling on chat data
├── build_data.py              # Data preparation pipeline
├── analyze_chat.py            # Chat interaction analysis
├── analyze_phase_metrics.py   # Evaluation phase metrics & statistics
└── thesis/
    └── diploma_thesis_DimitriosStasinos.pdf

Personalities
PersonalityTrigger ConditionCommunication Style😊 HappyAll needs metWarm, playful, affectionate😤 AngryNeglected needsGrumpy, demanding, sarcastic😢 SadProlonged neglectMelancholic, emotional
The active personality is determined by a mood score derived from real-time sensor readings, with dynamic adjustments based on weather data.

Hardware

Raspberry Pi 4B
IO Expansion HAT
DHT22 — Temperature & Humidity sensor
SEN0193 — Capacitive soil moisture sensor
VEML7700 — Ambient light sensor
Small display screen


Evaluation
The system was evaluated in two phases:

Phase 1: Public space (university cafeteria) — 2 months, larger user group
Phase 2: Workplace setting (retail store) — 2 weeks, smaller group near register

Phase 2 showed significantly higher engagement and improved plant care response rates compared to Phase 1.

Tech Stack

Hardware: Raspberry Pi 4B, Python
Backend: Flask, Socket.IO
LLM: Google Gemini API
Database: Google Firestore
Analysis: scikit-learn (NMF, Logistic Regression), pandas, ANOVA
