import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty empty--tall">
        <p className="eyebrow">404</p>
        <h1>This page drifted off.</h1>
        <Link to="/" className="btn">Back home</Link>
      </div>
    </div>
  );
}
