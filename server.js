import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

// 1. Initialize Google GenAI (Using your API Key)
const ai = new GoogleGenAI({ apiKey: "YOUR_GEMINI_API_KEY" });

// 2. Initialize Local Relational SQL Database (SQLite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './support_tickets.sqlite',
  logging: false
});

// 3. Define the Normalized Relational Schema
const Ticket = sequelize.define('Ticket', {
  customer_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  issue_description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING },      // Extracted by AI
  urgency: { type: DataTypes.STRING },       // Extracted by AI
  status: { type: DataTypes.STRING, defaultValue: 'Open' }
});

// Sync database schema
sequelize.sync();

// 4. Test Route
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ success: true, message: "Relational SQLite database layer connected and active!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Asynchronous RESTful Payload Interceptor & Triage Endpoint
app.post('/api/tickets', async (req, res) => {
  try {
    const { customer_name, email, issue_description } = req.body;

    if (!customer_name || !email || !issue_description) {
      return res.status(400).json({ success: false, error: "Missing required payload fields" });
    }

    // --- GenAI Intelligence Layer ---
    // Prompting the model to parse unstructured text and return strict JSON metadata
    const prompt = `
      Analyze this customer support issue: "${issue_description}"
      Provide a classification category (e.g., Technical, Billing, Account Access) and an urgency metric (Low, Medium, High).
      Respond ONLY with a valid JSON object matching this structure:
      {"category": "string", "urgency": "string"}
    `;

    let category = "General";
    let urgency = "Medium";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      const aiMetadata = JSON.parse(response.text.trim());
      category = aiMetadata.category || category;
      urgency = aiMetadata.urgency || urgency;
    } catch (aiError) {
      console.log("AI triage fallback activated:", aiError.message);
    }

    // --- Relational Logging Layer ---
    const newTicket = await Ticket.create({
      customer_name,
      email,
      issue_description,
      category,
      urgency
    });

    res.status(201).json({
      success: true,
      message: "Ticket structured by GenAI and logged into database successfully!",
      ticket: newTicket
    });

  } catch (error) {
    res.status(500).json({ success: false, error: "Downstream connectivity failure: " + error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Advanced Server running on http://localhost:3000`));