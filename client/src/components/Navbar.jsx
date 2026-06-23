import { useModels } from '../context/ModelContext';
import { HiPlus } from 'react-icons/hi';

export default function Navbar({ onAddClick }) {
  const { models } = useModels();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🧠</span>
        <span className="navbar-title text-gradient">AI Pocket</span>
      </div>

      <div className="navbar-actions">
        <span className="navbar-count">{models.length} Models</span>
        <button className="btn btn-primary" onClick={onAddClick}>
          <HiPlus />
          <span>Add Model</span>
        </button>
      </div>
    </nav>
  );
}
