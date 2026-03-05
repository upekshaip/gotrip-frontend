import React from 'react';

const Sidebar = () => {
  const menuItems = ['Dashboard', 'Hotels', 'Transports', 'Users', 'Settings'];
  return (
    <div className="w-64 bg-slate-900 h-screen p-5 text-white hidden md:block">
      <h1 className="text-2xl font-black text-blue-400 mb-10 italic">GoTrip Admin</h1>
      <ul className="space-y-4">
        {menuItems.map(item => (
          <li key={item} className="hover:text-blue-400 cursor-pointer transition-colors font-medium">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;