import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <h1 className="text-3xl font-bold">Niet gevonden</h1>
      <p className="text-muted">Deze pagina bestaat niet (meer).</p>
      <Link to="/">
        <Button>Naar startpagina</Button>
      </Link>
    </div>
  );
}
