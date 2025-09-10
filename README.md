# Monty Hall Learning Platform

An interactive educational platform for exploring the Monty Hall problem and its many variants. The platform supports both hands-on play and large-scale simulations with different Monty behaviors, user interaction, and research data collection.

Deployment target: https://monty-hall.bram-hub.com

---

## Overview

This project provides a modern web interface for simulating and analyzing variations of the Monty Hall game show problem. It supports:

- Interactive single game play  
- Simulation mode for running thousands of games  
- Configurable Monty behaviors (Standard, Evil, Secretive, or fully customizable)  
- Player strategies (Always Stay, Always Switch, Random)  
- Data visualization with charts and outcome statistics  
- Educational content and mathematical explanations  

---

## Technologies Used

- React with TypeScript (frontend)  
- Vite (development server and build tool)  
- Node.js + Express (backend API for stats and data handling)  
- Chart.js (data visualization)  
- AWS Route53 and CDK (subdomain and DNS configuration)  
- Supabase (planned: backend storage for research data)  

---

## Project Structure

    monty-hall/
    ├── backend/         # Node/Express backend (API endpoints, stats handling)
    ├── public/          # Static assets and CNAME if using custom domain
    ├── src/
    │   ├── assets/      # Images and media
    │   ├── components/  # Reusable UI and game components
    │   ├── logic/       # Core Monty engine, probability tables, types
    │   ├── pages/       # Route-based views (PlayPage, EducationPage, ResultsPage, etc.)
    │   └── ...
    └── vite.config.ts   # Vite config (proxy / base path)

---

## Running the Project Locally

### Prerequisites

- Node.js (v18 or later)  
- npm (comes with Node)

### Setup Instructions

Open **two terminals**:

**Terminal 1: Start backend**

    cd backend
    npm install   # first time only
    node server.js

Backend will run on: http://localhost:3000

**Terminal 2: Start frontend**

    cd monty-hall   # project root
    npm install     # first time only
    npm run dev

Frontend will run on: http://localhost:5173 and proxy API requests to the backend via `/api` (configured in `vite.config.ts`).

> If a "Public Base URL" is required in development, create a `.env.development` file in the repo root with:  
> `PUBLIC_BASE_URL=http://localhost:5173`

---

## Project Goals

- Enable interactive exploration of probability and decision theory  
- Demonstrate the impact of different Monty behaviors  
- Support simulations with configurable parameters  
- Provide charts and statistics for outcome analysis  
- Collect structured gameplay data for future research  
- Offer an education section explaining the Monty Hall problem  

---

## Planned Features

- Supabase integration for persistent data storage  
- Custom Monty and player strategy builders  
- Advanced visualization and research dashboards  
- Expanded educational resources  

---

## Background

The Monty Hall problem is a famous probability puzzle where the counterintuitive optimal strategy (to switch doors) makes it a central teaching tool in statistics and cognitive science.  
This platform explores the classical problem and extends it to many variants for deeper learning.

More information: https://en.wikipedia.org/wiki/Monty_Hall_problem

---

## Maintainers

- Project Lead: Professor Bram (bram-hub.com)  
- Developers: Kyle-J13 (https://github.com/Kyle-J13), Ameyabarve123 (https://github.com/Ameyabarve123)

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
