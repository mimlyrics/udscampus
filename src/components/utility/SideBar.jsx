import React from 'react';
import facultyColors from '../constants/facultyColor';
import anyImage from "../../../assets/martinique-4900895_1920.jpg"
import './Sidebar.css';

const Sidebar = ({ selectedBuilding, routingEnabled, setRoutingEnabled, selectedFaculty, setSelectedFaculty, theme, t, lang }) => {
  return (
    <div className={`w-full md:w-96 p-4 bg-white border-r border-gray-200 overflow-y-auto sidebar-container  ${theme.legendBg} ${theme.legendText}`}>
      <h2 className="text-lg font-semibold mb-4">Informations sur le bâtiment</h2>

      {console.log(selectedBuilding)}
      {selectedBuilding ? (
        <div className="mb-6 p-4 ">
          <h3 className="font-bold text-purple-900 ">Nom: {selectedBuilding.name}</h3>
          <p className="text-md font-mono p-2 text-amber-800">Faculté: {selectedBuilding.faculty}</p>
          <p className="text-sm mt-1 text-cyan-800 font-bold">Description: {selectedBuilding.description.substring(0,250)}</p>
          
          {selectedBuilding.image && (
            <img src={selectedBuilding.image} alt={selectedBuilding.name} className="mt-2 w-full h-60 rounded" />
          )}
        </div>
      ) : (
        <p className="text-lg mb-4 text-purple-800 ">Sélectionnez un bâtiment pour voir les détails.</p>
      )}

      {/* Faculty Filter */}
      <div className="mb-4">
        <label htmlFor="facultyFilter" className="block font-medium mb-1">
          Filtrer par faculté
        </label>
        <select
          id="facultyFilter"
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value.trim())}
          className="w-full border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Toutes les facultés</option>
          {Object.keys(facultyColors)
            .filter(faculty => faculty !== 'default')
            .map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
        </select>
      </div>

      {/* Routing toggle */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Navigation</label>
        <button
          onClick={() => setRoutingEnabled(!routingEnabled)}
          className="px-4 py-1 bg-blue-600 text-white rounded"
        >
          {routingEnabled ? 'Désactiver la navigation' : 'Activer la navigation'}
        </button>
      </div>


            <div className="bg-white bg-opacity-80 p-2 rounded-lg shadow-md">
              <label className="block font-bold mb-1">{t.language}:</label>
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className={`w-full p-2 rounded border ${theme.select}`}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
    </div>
  );
};

export default Sidebar;  