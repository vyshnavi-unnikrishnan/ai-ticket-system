   # GenAI-Powered Customer Support Ticketing System

   An Express.js backend that takes customer support requests and uses Google Gemini to classify each ticket by category and urgency before saving it to a database.

   ## Features
   - REST API: POST /api/tickets to submit a ticket, GET /test-db to check the database
   - Input validation for required fields
   - Gemini extracts category and urgency as JSON
   - Falls back to default values if the AI call fails
   - Relational storage with Sequelize and SQLite

   ## Tech Stack
   Node.js | Express.js | Sequelize | SQLite | Google Gemini API
