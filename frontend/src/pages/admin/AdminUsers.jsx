import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../../api/adminService';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (id, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            try {
                await updateUser(id, { role: newRole });
                toast.success('User role updated successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to update user role');
            }
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        if (window.confirm(`Are you sure you want to change this user's status to ${newStatus}?`)) {
            try {
                await updateUser(id, { accountStatus: newStatus });
                toast.success('User status updated successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to update user status');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Manage Users</h1>
            </div>

            <div className="admin-table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`status-badge status-${user.role.toLowerCase()}`} style={{ backgroundColor: user.role === 'Admin' ? '#c7d2fe' : '#e0e7ff', color: user.role === 'Admin' ? '#3730a3' : '#4338ca' }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${user.accountStatus ? user.accountStatus.toLowerCase() : 'active'}`} style={{ backgroundColor: user.accountStatus === 'Inactive' ? '#fee2e2' : '#d1fae5', color: user.accountStatus === 'Inactive' ? '#991b1b' : '#065f46' }}>
                                            {user.accountStatus || 'Active'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {user.role === 'User' ? (
                                            <button className="action-btn btn-edit" onClick={() => handleRoleChange(user._id, 'Admin')}>Make Admin</button>
                                        ) : (
                                            <button className="action-btn btn-edit" onClick={() => handleRoleChange(user._id, 'User')} style={{ backgroundColor: '#64748b' }}>Revoke Admin</button>
                                        )}
                                        <button className="action-btn btn-reject" onClick={() => handleStatusChange(user._id, user.accountStatus || 'Active')}>
                                            {(!user.accountStatus || user.accountStatus === 'Active') ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button className="action-btn btn-delete" onClick={() => handleDelete(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
