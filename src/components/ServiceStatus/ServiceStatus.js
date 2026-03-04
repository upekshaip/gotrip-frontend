/*import React from 'react';

const ServiceStatus = () => {
  const services = [
    { name: 'Hotel Service', status: 'Online', color: 'text-green-500' },
    { name: 'Transport Service', status: 'Online', color: 'text-green-500' },
    { name: 'Review Service', status: 'In Progress', color: 'text-yellow-500' }
  ];

  return (
    <div className="p-4 bg-base-200 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Microservices Monitor</h2>
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.name} className="flex justify-between p-2 bg-white rounded shadow-sm">
            <span className="font-medium text-gray-700">{s.name}</span>
            <span className={`font-bold ${s.color}`}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceStatus;