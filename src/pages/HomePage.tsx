import { Link, useNavigate } from 'react-router'
import { HomeScreen } from '@/components/HomeScreen'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <HomeScreen
      onGenerate={() => navigate('/generation')}
      onChrono={() => navigate('/chrono')}
      footerExtra={
        <Link to="/configuration" className="font-medium text-accent-secondary">
          Configuration
        </Link>
      }
    />
  )
}
