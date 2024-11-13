const Button = ({ onClick, children, type, className, disabled }) => {
    // Apply different styles for different button types in the future.
    // Eg: "show-importance", "error", "success", "login" buttons etc.

    let buttonClass = className || 'btn';

    if (type === 'submit') {
        return (
            <button type="submit" className={`${buttonClass} btn-primary`} disabled={disabled}>
                {children}
            </button>
        );
    }

    if (type === 'toggle-importance') {
        return (
            <button className={`${buttonClass}`} onClick={onClick} disabled={disabled}>
                {children}
            </button>
        );
    }

    if (type === 'toggle-login') {
        return (
            <button className={`${buttonClass} btn-primary`} onClick={onClick} disabled={disabled}>
                {children}
            </button>
        );
    }

    return (
        <button className={buttonClass} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
