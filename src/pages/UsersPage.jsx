import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../reducers/userSlice.js';
import { Link } from 'react-router-dom';

const UsersPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const status = useSelector((state) => state.user.status);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Failed to load users</p>;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Blogs Created</th>
          <th>Role</th>
        </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
          <tr key={user.id}>
            <th>{index + 1}</th>
            <td>
              <Link to={`/users/${user.id}`} className="text-blue-500 hover:underline">
                {user.name}
              </Link>
            </td>
            <td>{user.blogs ? user.blogs.length : 0}</td>
            <td>{user.role || 'User'}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;