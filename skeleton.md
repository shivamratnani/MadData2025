# Project Overview

## Project Name: Dream Analyzer
**Description:**
A web application where authenticated users can submit free-text dream entries and receive an AI-generated analysis. The analysis involves two main AI components:
- BERT Model: Automatically extracts up to 15 common themes/symbols from the dream.
- Gemini 2.0 Flash: Accessed via an external API to provide a batched, detailed analysis.
The app features a fully conversational chat interface that allows users to interact with the analysis, compare new and old interpretations, and search through past dreams.

## User Management & Authentication
- **Authentication Provider:** Supabase handles user auth and database storage.
- **Features:**
  - Login/Register (Guest users cannot submit dreams)
  - Profile management: Users can change their profile picture, name, and password.
  - Placeholders for profile edits will be added initially.

## Dream Submission & Analysis Workflow

### Dream Input
- **Input Type:** Free-text dream entry.
- **Date/Time Handling:**
  - Automatically capture date/time on submission.
  - Allow users to adjust the timestamp manually if needed.

### Analysis Process
1. Submit dream → Display a "Crafting analysis" status.
2. **BERT Analysis:**
   - Extract up to 15 themes/symbols from the dream.
   - **Fine-Tuning:**
     - Pre-deployment fine-tuning on the 20,000-dream dataset is recommended for faster performance.
     - Consider using libraries like HuggingFace Transformers.
3. **Gemini 2.0 Flash:**
   - Access via an external API for further analysis.
   - **Prompt Engineering:**
     - Placeholder for configuring and refining the prompts used for Gemini.
4. Save the complete result (dream text, themes/symbols, analysis) automatically in the database.
5. **Re-run Analysis:**
   - Users can click a "change input" button.
   - Both old and new analyses are retained in history for comparison.

### Conversational Chat Interface
- **Central Chat Panel:**
  - Fully conversational interface with batched responses.
  - New input is always accepted; previous conversation history is immutable.
- **Search Functionality:**
  - Minimal design with three filter buttons: Dreams, Themes/Symbols, Analysis (default filter: All).
  - Allows users to search/filter past entries.
- **History & Detailed View:**
  - Left side panel shows a history of dreams with corresponding analysis.
  - Clicking a past dream opens a detailed read-only view, with the option to "change input" for re-analysis.

## Error Handling & Asynchronous Processing

### Asynchronous Processing
- **Placeholder Section:**
  - Outline potential integration with asynchronous processing tools (e.g., Celery or Django's async capabilities).
  - Notes for future integration include:
    - Automatic retry mechanisms for BERT and Gemini API calls.
    - Configurable retry limits and exponential backoff strategies.

### Error Reporting & User Feedback
- **Generic Error Module:**
  - Provide user-friendly messages (e.g., "Something went wrong, please try again") when errors occur.
  - Log errors internally for debugging and possible integration with third-party tools (e.g., Sentry) in the future.
- **Error Scenarios:**
  - Handle timeouts, failed model responses, and network/API issues.
  - Ensure both AI (Gemini API) and BERT errors are retried appropriately.

## Integration Points & API Endpoints

### High-Level Integration
- **Backend:** Django serves as the main application server.
- **Frontend:** JavaScript manages the chat interface and search functionalities.
- **Authentication & DB:** Supabase handles user authentication and data storage.

### Key API Endpoints (High-Level)
- `/api/auth/`
  - Authentication endpoints (login, register, update profile).
- `/api/dreams/`
  - POST: Submit a new dream entry.
  - GET: Retrieve list/history of dreams.
- `/api/analysis/`
  - GET: Retrieve analysis details for a specific dream.
  - POST: Trigger re-analysis using the "change input" feature.

### Data Flow Diagram (Placeholder)
- **Diagram Elements:**
  - Dream Input → Django Endpoint → BERT Processing (pre-deployment fine-tuning note) → Gemini API → Save Result to Supabase.
  - Conversational interface pulls data from Django, integrates with the search and history view.
  - A placeholder diagram should be added here later to illustrate the data flow.

## File Structure & Future Considerations

### Current High-Level Structure
