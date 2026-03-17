export default function Landing({ onSignupClick, onSigninClick }) {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-heading">Demo Project</h1>
        <p className="landing-subtitle">
          A simple authentication system with login tracking
        </p>

        <div className="auth-buttons">
          <button
            className="btn btn-primary"
            onClick={onSignupClick}
          >
            Sign Up
          </button>
          <button
            className="btn btn-secondary"
            onClick={onSigninClick}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
