import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-5">
      <p className="font-display text-7xl font-semibold text-crust mb-4">404</p>
      <h1 className="text-2xl font-semibold mb-3">This slice is missing</h1>
      <p className="text-char/60 mb-8 max-w-sm">
        The page you're looking for isn't on the menu. Let's get you back to something tasty.
      </p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  )
}
