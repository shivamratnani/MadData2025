# MadHacks2025

## Setup Instructions

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

3. Install dependencies:
   ```bash
   cd web
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

## Running the Application

1. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

2. Access the application:
   - Main application: http://localhost:8000
   - Admin interface: http://localhost:8000/admin

## Project Structure

- `web/` - Django web application
- `backend/` - Machine learning models and preprocessing
- `myapp/` - Main Django application

## Development

- Make sure to run `python manage.py makemigrations` after modifying models
- Use `python manage.py migrate` to apply database changes