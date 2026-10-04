import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Threadline home">Threadline</Link>
        <span className="site-header__tagline">Everyday clothing for everyone</span>
      </div>
    </header>
  );
}
