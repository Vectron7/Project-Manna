import React, { useState } from 'react';
import MoodPopup from './components/MoodPopup';
import { moodService } from '../api/moodService';
import './Home.css';

const Home = () => {
  const [active, setActive] = useState(true);

  const handleSelect = async (mood) => {
    await moodService.send(mood);
    setActive(false); // Fecha o popup após o serviço confirmar (RN03)
  };

  return (
    <div className="home-page">
      {active ? (
        <MoodPopup onSelect={handleSelect} />
      ) : (
        <div className="status-board">
          <h1>Sistema Operacional</h1>
          <p>Monitoramento de humor ativo.</p>
        </div>
      )}
    </div>
  );
};

export default Home;