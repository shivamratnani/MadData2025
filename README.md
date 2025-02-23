# Dream Analyzer

A web application for recording and analyzing dreams using AI. Users can submit dream entries and receive AI-generated analysis of themes, symbols, and interpretations.

## Features

- Dream journal with AI-powered analysis
- Theme and symbol extraction using BERT
- Detailed interpretations via Gemini 2.0
- Interactive chat interface for exploring dreams
- Dark/light mode support
- Calendar view and dream timeline
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Django
- **Database:** Supabase
- **AI Models:** 
  - BERT for theme extraction
  - Gemini 2.0 for interpretations
- **Authentication:** Supabase Auth

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- pip
- npm or yarn

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install Python dependencies:
   ```bash
   cd web
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase and Gemini API credentials
   ```

5. Set up the database:
   ```bash
   python manage.py migrate
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd web/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API endpoints and credentials
   ```

## Running the Application

1. Start the Django development server:
   ```bash
   cd web
   python manage.py runserver
   ```

2. In a new terminal, start the React development server:
   ```bash
   cd web/frontend
   npm start
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin interface: http://localhost:8000/admin

## Project Structure

- `web/` - Django web application
- `backend/` - Machine learning models and preprocessing
- `myapp/` - Main Django application

## Development

- Make sure to run `python manage.py makemigrations` after modifying models
- Use `python manage.py migrate` to apply database changes