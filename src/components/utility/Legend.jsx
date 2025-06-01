// src/components/Legend.jsx
import React from 'react';

const facultyColors = {
  'Bâtiments Administratifs': '#f44336',
  'Dortoires Universitaires': '#9e9e9e',
  'F.A.S.A': '#4caf50',
  'F.L.S.H': '#FFB6C1',
  'F.M.S.P': '#2196f3',
  'F.S': '#e91e63',
  'F.S.J.P': '#795548',
  'Complexe Sportifs': '#3AB09E',
  'Toilettes Publiques': '#9932CC',
  'Points de Récréation': '#D2691E',
  'Résidences Privées': 'grey',
  'Restaurants Universitaires': 'brown',
  'Châteaux d’eau': 'purple',
  'Centre de Santé': 'blue',
  'Arrêt Bus': 'lightsalmon',
  'Points Commerciaux': '#DDA0DD',
  'Parking': 'purple',
  'F.L.S.H/F.S': '#FF7F50',
  'F.L.S.H/F.A.S.A/F.S': '#DAA520',
};

const Legend = () => {
  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-md z-10 max-w-xs text-sm">
      <h4 className="font-semibold mb-2">Legend</h4>
      <ul>
        {Object.entries(facultyColors).map(([faculty, color]) => (
          <li key={faculty} className="flex items-center mb-1">
            <span
              className="inline-block w-4 h-4 mr-2 rounded"
              style={{ backgroundColor: color }}
            ></span>
            {faculty}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
