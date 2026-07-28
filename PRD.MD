

---

# Product Requirements Document (PRD)

## Project Name

**FitGear AI**
We have our PRD here: [replace with your PRD file]. Based off of this, create a step by step plan to implement the first prototype of this project. The design is already implemented, but it is not the final version at all. I want to make a proper app prototype with basic functionality. Create a MD file of this plan. Do not edit any code yet. Let me know if you have questions
## Overview

FitGear AI is a mobile-friendly web application that helps youth hockey players and parents find the right hockey equipment based on the player's age, skill level, position, and experience.

Instead of spending time researching what gear is appropriate, users answer a few simple questions and receive AI-powered equipment recommendations with a brief explanation.

---

# Goal

Build a simple web app that helps users quickly find hockey equipment that matches their playing level.

The focus of the MVP is providing quality recommendations—not shopping, pricing, or reviews.

---

# Target Users

* Youth hockey players
* Parents buying equipment for their children

---

# Problem

Many players and parents don't know which hockey equipment is appropriate for their level.

Buying the wrong equipment can lead to poor protection, discomfort, or unnecessary expense.

---

# MVP Features

## 1. Landing Page

The homepage should include:

* App name
* Short description
* "Find My Gear" button

---

## 2. Questionnaire

The user answers a few questions:

* Age
* Skill Level

  * Beginner
  * House League
  * Travel
  * AA
  * AAA
* Position

  * Forward
  * Defense
  * Goalie
* Equipment Needed

  * Helmet
  * Skates
  * Stick
  * Gloves
  * Shoulder Pads
  * Elbow Pads
  * Pants
  * Shin Guards

---

## 3. AI Recommendation

After submitting the questionnaire, the AI returns:

* Recommended brand
* Recommended model
* Protection level
* Short explanation of why it was chosen

Example:

> Based on your age and skill level, the Bauer Re-Akt 150 is a great choice because it provides strong protection for competitive youth players while remaining lightweight and comfortable.

---

# User Flow

1. Open FitGear AI
2. Tap **Find My Gear**
3. Complete the questionnaire
4. Submit answers
5. View AI recommendations

---

# Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui
* **AI:** OpenAI API

---

# Design Requirements

The application should be **mobile-first**.

Requirements:

* Looks great on phones
* Responsive on tablets and desktops
* Large buttons for touch screens
* Clean, simple interface
* Fast loading
* Easy navigation

---



---

# Success Criteria

The MVP is complete when:

* Users can complete the questionnaire.
* AI generates equipment recommendations based on the user's answers.
* Recommendations include a brief explanation.
* The application is fully responsive and works well on mobile devices.
* The application is built using Next.js and TypeScript.

---

