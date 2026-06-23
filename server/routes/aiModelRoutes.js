import { Router } from 'express';
import {
  getAllModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel,
  searchModels,
} from '../controllers/aiModelController.js';

const router = Router();

/**
 * @route   GET /api/models
 * @desc    Get all AI models
 */
router.get('/', getAllModels);

/**
 * @route   GET /api/models/search?q=query
 * @desc    Search AI models by name, description, or tags
 * @note    Must be defined BEFORE /:id to prevent "search" matching as an ID
 */
router.get('/search', searchModels);

/**
 * @route   GET /api/models/:id
 * @desc    Get a single AI model by ID
 */
router.get('/:id', getModelById);

/**
 * @route   POST /api/models
 * @desc    Create a new AI model
 */
router.post('/', createModel);

/**
 * @route   PUT /api/models/:id
 * @desc    Update an AI model by ID
 */
router.put('/:id', updateModel);

/**
 * @route   DELETE /api/models/:id
 * @desc    Delete an AI model by ID
 */
router.delete('/:id', deleteModel);

export default router;
