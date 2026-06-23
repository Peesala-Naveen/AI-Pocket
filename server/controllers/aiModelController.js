import { pool } from '../config/db.js';

// DTO Mapper to convert Postgres columns to match Mongo schema expected by frontend
const mapModel = (row) => {
  if (!row) return null;
  return {
    _id: row.id.toString(), // Convert to string to match ObjectId behavior
    name: row.name,
    link: row.link,
    description: row.description,
    category: row.category,
    icon: row.icon,
    color: row.color,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Get all AI models, sorted by creation date (newest first).
 */
export const getAllModels = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ai_models ORDER BY created_at DESC');
    res.status(200).json(result.rows.map(mapModel));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch models', error: error.message });
  }
};

/**
 * Get a single AI model by ID.
 */
export const getModelById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(404).json({ message: 'Model not found — invalid ID format' });
    }

    const result = await pool.query('SELECT * FROM ai_models WHERE id = $1', [parseInt(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }

    res.status(200).json(mapModel(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch model', error: error.message });
  }
};

/**
 * Create a new AI model.
 */
export const createModel = async (req, res) => {
  try {
    const { name, link, description, category, icon, color, tags } = req.body;

    if (!name || !link || !description) {
      return res.status(400).json({
        message: 'Validation error',
        errors: {
          ...(!name && { name: 'Name is required' }),
          ...(!link && { link: 'Link is required' }),
          ...(!description && { description: 'Description is required' }),
        },
      });
    }

    const queryText = `
      INSERT INTO ai_models (name, link, description, category, icon, color, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      name,
      link,
      description,
      category || 'Other',
      icon || '🤖',
      color || '#6C63FF',
      tags || [],
    ];

    const result = await pool.query(queryText, values);
    res.status(201).json(mapModel(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Failed to create model', error: error.message });
  }
};

/**
 * Update an existing AI model by ID.
 */
export const updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(404).json({ message: 'Model not found — invalid ID format' });
    }

    const { name, link, description, category, icon, color, tags } = req.body;

    // Check if model exists first
    const checkExist = await pool.query('SELECT * FROM ai_models WHERE id = $1', [parseInt(id)]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }

    const existing = checkExist.rows[0];

    const queryText = `
      UPDATE ai_models
      SET name = $1, link = $2, description = $3, category = $4, icon = $5, color = $6, tags = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      name !== undefined ? name : existing.name,
      link !== undefined ? link : existing.link,
      description !== undefined ? description : existing.description,
      category !== undefined ? category : existing.category,
      icon !== undefined ? icon : existing.icon,
      color !== undefined ? color : existing.color,
      tags !== undefined ? tags : existing.tags,
      parseInt(id),
    ];

    const result = await pool.query(queryText, values);
    res.status(200).json(mapModel(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: 'Failed to update model', error: error.message });
  }
};

/**
 * Delete an AI model by ID.
 */
export const deleteModel = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(404).json({ message: 'Model not found — invalid ID format' });
    }

    const result = await pool.query('DELETE FROM ai_models WHERE id = $1 RETURNING *', [parseInt(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }

    res.status(200).json({ message: `Model "${result.rows[0].name}" deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete model', error: error.message });
  }
};

/**
 * Search AI models using SQL text and array matching.
 */
export const searchModels = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      const result = await pool.query('SELECT * FROM ai_models ORDER BY created_at DESC');
      return res.status(200).json(result.rows.map(mapModel));
    }

    const queryStr = `%${q.trim()}%`;

    // Query to find match in name, description, or tags array (case-insensitive ILIKE)
    const queryText = `
      SELECT * FROM ai_models
      WHERE name ILIKE $1
         OR description ILIKE $1
         OR array_to_string(tags, ',') ILIKE $1
      ORDER BY 
        CASE 
          WHEN name ILIKE $1 THEN 1
          WHEN description ILIKE $1 THEN 2
          ELSE 3
        END ASC, 
        created_at DESC
    `;

    const result = await pool.query(queryText, [queryStr]);
    res.status(200).json(result.rows.map(mapModel));
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};
