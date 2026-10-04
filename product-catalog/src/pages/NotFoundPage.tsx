import { Link } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage';

export default function NotFoundPage() {
  return (
    <StatusMessage title="Page not found" message="The page you opened does not exist.">
      <Link to="/" className="btn">Browse all products</Link>
    </StatusMessage>
  );
}
