import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Scene3D from './components/Scene3D';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import ModelGrid from './components/ModelGrid';
import AddModelModal from './components/AddModelModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Scene3D />

      <div className="app-content">
        <Navbar onAddClick={() => setIsModalOpen(true)} />

        <main className="main-content">
          <header className="hero-section">
            <h1 className="text-gradient">AI Pocket</h1>
            <p className="hero-subtitle">
              Your 3D AI Model Vault — Store, discover, and launch AI models instantly
            </p>
          </header>

          <SearchBar />
          <ModelGrid />
        </main>
      </div>

      <AddModelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'toast-custom',
          duration: 3000,
        }}
      />
    </>
  );
}
