import Button from './Button.jsx';
import PropTypes from 'prop-types';

const LoginForm = ({
                       handleSubmit,
                       handleUsernameChange,
                       handlePasswordChange,
                       username,
                       password,
                   }) => {
    return (
        <div className={'card bg-base-100 w-96'}>

            <form onSubmit={handleSubmit} className={'card-body'}>
                <h2 className={'card-title'}>Login</h2>
                <div className={'form-control'}>
                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        Username
                        <input type="text"
                               value={username}
                               onChange={handleUsernameChange}
                               className="grow"
                               placeholder="" />
                    </label>
                </div>
                <div className={'form-control'}>
                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd" />
                        </svg>
                        Password
                        <input type="password"
                               value={password}
                               onChange={handlePasswordChange}
                               className="grow"
                               placeholder="" />
                    </label>
                </div>
                <Button type={'submit'}>logins</Button>
            </form>
        </div>
    );
};

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
};

export default LoginForm;