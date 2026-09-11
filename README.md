# 🦧 The Orangutan Mystery

### Five Babies. One Mystery.

An interactive data-storytelling investigation into the discovery of five juvenile orangutans in Odisha, India.

🔎 **Live project:**  
https://prakharquant.github.io/orangutan-odisha-mystery/

---

## The Case

In September 2026, five juvenile orangutans were found together in the Bhograi area of Balasore district, Odisha.

The discovery raises a simple but extraordinary question:

> How did five young orangutans, native to Southeast Asia, end up in coastal Odisha?

The project approaches the story as an open investigation rather than assuming a conclusion.

---

## What This Project Explores

### 🗺️ Route Investigation

The interactive map presents four possible explanations:

- **Natural dispersal**
- **Road / overland transport**
- **Maritime transport**
- **Air transport**

The routes shown on the map are **illustrative hypotheses, not confirmed trafficking routes**.

Each hypothesis is accompanied by an explanation of what evidence would be required to support or reject it.

### 🧬 The Missing Mothers

Orangutans have an unusually long period of maternal dependence.

Finding five young animals together without their mothers therefore becomes an important investigative clue.

The project examines why this matters without treating the absence of the mothers as proof of trafficking.

### 🔍 Evidence & Investigation

The investigation framework considers potential evidence including:

- CCTV footage
- Vehicle movements
- Witness accounts
- Airport records
- Port and coastal activity
- Railway movements
- Wildlife facility records
- Possible trafficking networks

A key principle of the project is distinguishing **evidence from inference**.

### 🚨 The Black SUV

Reports of a black SUV near the area before the discovery provide an interesting investigative lead.

The project deliberately treats this as a **clue requiring verification**, rather than evidence that the vehicle was involved.

### 📰 Live Case Updates

The site includes a live news section showing recent reporting about the case.

The architecture is:

**Google News RSS → GitHub Actions → `news.json` → Website**

GitHub Actions periodically fetches recent reports and updates the static `news.json` file, allowing the GitHub Pages site to display current developments without requiring a backend server.

---

## Design Philosophy

The project is designed as an interactive investigation dossier rather than a conventional article.

It combines:

- Data storytelling
- Geographic visualization
- Interactive hypotheses
- Evidence evaluation
- Narrative design
- Live information updates

The goal is to make the user **investigate the case rather than simply read about it**.

---

## Technology

- **HTML**
- **CSS**
- **JavaScript**
- **Leaflet.js**
- **OpenStreetMap**
- **Google News RSS**
- **GitHub Actions**
- **GitHub Pages**

No traditional backend is required.

---

## Project Structure

```text
orangutan-odisha-mystery/
│
├── index.html
├── style.css
├── script.js
├── news.json
│
└── .github/
    └── workflows/
        └── update-news.yml
