const Notification = ({ message, messageType }) => {
    if (message && messageType === 'success') {
        return (
            <div className="toast">
                <div className="alert alert-success">
                    <span>{message}</span>
                </div>
            </div>
        );
    }

    if (message && messageType === 'error') {
        return (
            <div className="toast">
                <div className="alert alert-error">
                    <span>{message}</span>
                </div>
            </div>
        );
    }

    if (message === null) {
        return null;
    }

};

export default Notification;