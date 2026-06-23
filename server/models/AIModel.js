import mongoose from 'mongoose';

/**
 * @typedef {Object} AIModel
 * @property {string} name - Display name of the AI model
 * @property {string} link - URL to the model's homepage
 * @property {string} description - Detailed description of the model
 * @property {string} category - Classification category
 * @property {string} icon - Emoji icon for the model
 * @property {string} color - Hex color code for UI theming
 * @property {string[]} tags - Searchable tags for categorization
 * @property {Date} createdAt - Auto-generated creation timestamp
 * @property {Date} updatedAt - Auto-generated update timestamp
 */
const aiModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    link: {
      type: String,
      required: [true, 'Model link is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: {
        values: [
          'Text Generation',
          'Image Generation',
          'Code Assistant',
          'Audio & Speech',
          'Video Generation',
          'Multimodal',
          'Data & Analytics',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
      default: 'Other',
    },
    icon: {
      type: String,
      default: '🤖',
    },
    color: {
      type: String,
      default: '#6C63FF',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Full-text search index for name, description, and tags
aiModelSchema.index({ name: 'text', description: 'text', tags: 'text' });

const AIModel = mongoose.model('AIModel', aiModelSchema);

export default AIModel;
