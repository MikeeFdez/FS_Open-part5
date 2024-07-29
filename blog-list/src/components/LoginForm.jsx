import PropTypes from 'prop-types'

export const LoginForm = ({onSubmit, username, password, onUsernameChange, onPasswordChange}) => {
    
    LoginForm.propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onUsernameChange: PropTypes.func.isRequired,
        onPasswordChange: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
      }
    
      
    return (
        <form onSubmit={onSubmit}>
            <div>
                Username: <input type="text" name="username" username={username} onChange={onUsernameChange} />
            </div>
            <div>
                Password: <input type="password" name="password" password={password} onChange={onPasswordChange} />
            </div>
            <div>
                <button type='submit'>Log In</button>
            </div>
        </form>
    )
}