import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../reducers/userSlice';
import Blog from '../components/Blog';

const UserPage = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.users.find((u) => u.id === userId));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserById(userId));
        } else {
            setLoading(false);
        }
    }, [dispatch, userId, user]);

    if (loading) return <p>Loading user details...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="user-page">
            <h1 className={'text-2xl font-semibold'}>{user.name}</h1>
            <p>Role: {user.role || 'UserPage'}</p>
            <h2>added blogs</h2>
            <ul className={'flex flex-col gap-4 items-center'}>
                {user.blogs && user.blogs.length > 0 ? (
                    user.blogs.map((blog) => <Blog key={blog.id} blog={blog} />)
                ) : (
                    <p>No blogs found</p>
                )}
            </ul>
        </div>
    );
};

export default UserPage;