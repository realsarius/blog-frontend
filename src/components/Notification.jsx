import React from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {

    const notification = useSelector((state) => state.notification);

    if (!notification) {
        return null;
    }

    const { message, type } = notification;

    if (type === 'success') {
        return (
            <div className="toast">
                <div className="alert alert-success">
                    <span>{message}</span>
                </div>
            </div>
        );
    }

    if (type === 'error') {
        return (
            <div className="toast">
                <div className="alert alert-error">
                    <span>{message}</span>
                </div>
            </div>
        );
    }

    return null;
};

export default Notification;
