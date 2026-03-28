import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>User Management</h2>
      
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.full_name}</td>
                <td>{u.email}</td>
                <td><span className="badge badge-gray">{u.role}</span></td>
                <td>
                  <span className={`badge \${u.status === 'Active' ? 'badge-green' : 'badge-amber'}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  {u.status !== 'Active' && (
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85em', marginRight: '8px' }} onClick={() => updateStatus(u.id, 'Active')}>
                      Verify
                    </button>
                  )}
                  {u.status === 'Active' && u.role !== 'Nestle Admin' && (
                    <button className="btn-outline-red" style={{ padding: '6px 12px', fontSize: '0.85em' }} onClick={() => updateStatus(u.id, 'Deactivated')}>
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
