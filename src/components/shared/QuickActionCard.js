// File: src/components/shared/QuickActionCard.js

import React from 'react';

const QuickActionCard = ({ icon: Icon, title, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color]} hover:opacity-80 cursor-pointer transition-opacity`}>
      <Icon className="h-8 w-8 mx-auto mb-2" />
      <p className="text-center font-medium">{title}</p>
    </div>
  );
};

export default QuickActionCard;