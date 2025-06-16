# Monty Hall Learning Platform

An interactive educational platform for exploring the Monty Hall problem and its many variants. The platform supports simulations with different types of Monty behaviors, user interaction, and data collection for research and educational purposes.

Planned deployment: https://monty.bram-hub.com

---

## Overview

This project provides an interface for simulating and analyzing variations of the Monty Hall game show problem. It plans to supports:

- Interactive single game play
- Iterative simulations under controlled conditions
- Configurable Monty behaviors (Standard, Evil, Secretive, custom, etc.)
- Basic player strategies
- Data collection for cognitive psychology research
- Educational content and mathematical explanations

---

## Technologies Used

- React with TypeScript (frontend)
- Vite (build tool)
- Supabase (PostgreSQL database and API; for data collection)
- Vercel (frontend deployment platform)
- AWS Route53 and CDK (subdomain and DNS configuration)

---

## Project Structure

```
src/
├── components/   # Reusable UI elements
├── pages/        # Views like PlayPage, ResearchPage, EducationPage
├── logic/        # Game engine and Monty behavior logic
├── supabase/     # Database logic
```

---

## Running the Project Locally

### Prerequisites

- Node.js (v18 or later)

### Setup Instructions

```bash
git clone repo
cd monty-hall
npm install
npm run dev
```

Then open your browser to the localhost link given

---

## Project Goals

- Enable interactive exploration of probability and decision theory
- Demonstrate the impact of different Monty behaviors
- Support simulations with configurable parameters
- Collect structured gameplay data for research analysis
- Provide educational explanations from both intuitive and formal perspectives

---

## Planned Features

- Supabase integration for backend data storage
- Custom Monty and player strategy builders
- Data visualization with charts and graphs
- Research dashboard with aggregated statistics
- Comprehensive education section 

---

## Background

The Monty Hall problem is a well known probability puzzle where the counterintuitive nature of the correct strategy (to switch doors) makes it a widely discussed topic in statistics and cognitive science. This platform explores the classical problem and its many variants.

More information: [Monty Hall problem on Wikipedia](https://en.wikipedia.org/wiki/Monty_Hall_problem)

---

## Maintainers

- Project Lead: Professor Bram (bram-hub.com)
- Developer: [Kyle-J13](https://github.com/Kyle-J13)

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
