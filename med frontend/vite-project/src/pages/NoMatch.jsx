import { Link } from 'react-router-dom';

export default function NoMatch() {
  return (
    <div className="container py-5 text-center">
      <div className="card shadow-sm p-5">
        <h1>404</h1>
        <p className="lead">Page not found.</p>
        <Link to="/" className="btn btn-primary">
          Back Home
        </Link>
      </div>
    </div>
  );
}
