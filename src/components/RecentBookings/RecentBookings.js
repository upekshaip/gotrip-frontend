import React from 'react';

const RecentBookings = () => {
  const bookings = [
    { id: '#1024', user: 'Heshan M.', service: 'Hotel', date: '2026-03-07' },
    { id: '#1025', user: 'Upeksha', service: 'Transport', date: '2026-03-08' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
      <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Service</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="hover">
                <td>{b.id}</td>
                <td>{b.user}</td>
                <td><span className="badge badge-ghost">{b.service}</span></td>
                <td>{b.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;