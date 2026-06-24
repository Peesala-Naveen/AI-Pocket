import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Scene3D from './components/Scene3D';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import ModelGrid from './components/ModelGrid';
import AddModelModal from './components/AddModelModal';
import ConfirmModal from './components/ConfirmModal';
import AIVaultContainer from './components/AIVaultContainer';
import AIAgentCore from './components/AIAgentCore';
import InteractiveCursor from './components/InteractiveCursor';
import { useModels } from './context/ModelContext';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vaultState, setVaultState] = useState('closed'); // 'closed' | 'opening' | 'open' | 'closing'
  const { models, modelToEdit, setModelToEdit, confirmState, handleConfirm, handleCancel } = useModels();

  // Track global mouse position and bind to CSS variables for dynamic cursor tracking effects
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const handleVaultToggle = () => {
    if (vaultState === 'closed') {
      setVaultState('opening');
      setTimeout(() => {
        setVaultState('open');
      }, 950);
    } else if (vaultState === 'open') {
      setVaultState('closing');
      setTimeout(() => {
        setVaultState('closed');
      }, 750);
    }
  };

  // If a model is selected for editing, make sure the vault remains open
  useEffect(() => {
    if (modelToEdit !== null && vaultState === 'closed') {
      setVaultState('open');
    }
  }, [modelToEdit, vaultState]);

  return (
    <>
      <Scene3D />
      <InteractiveCursor />

      <div className="app-content">
        <Navbar onAddClick={() => setIsModalOpen(true)} />

        <main className="main-content">
          <header className="hero-section">
            <h1 className="text-gradient">AI Pocket</h1>
            <p className="hero-subtitle">
              Your 3D AI Model Vault — Store, discover, and launch AI models instantly
            </p>
          </header>

          <div className="vault-agent-workspace">
            <AIVaultContainer
              vaultState={vaultState}
              onToggle={handleVaultToggle}
              modelCount={models.length}
            />
            <AIAgentCore 
              vaultState={vaultState} 
              onToggleVault={handleVaultToggle}
              onOpenAddModal={() => setIsModalOpen(true)}
            />
          </div>

          {vaultState === 'open' && <SearchBar />}
          <ModelGrid vaultState={vaultState} />
        </main>
      </div>

      <AddModelModal
        isOpen={isModalOpen || modelToEdit !== null}
        onClose={() => {
          setIsModalOpen(false);
          setModelToEdit(null);
        }}
        modelToEdit={modelToEdit}
      />

      <ConfirmModal
        isOpen={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        type={confirmState?.type}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

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

