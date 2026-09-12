import { classNames } from '../utils/classNames.js'

export default function Loader({ fullScreen = false, label = 'Loading...' }) {
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center gap-3 text-char/60',
        fullScreen ? 'min-h-screen' : 'py-16'
      )}
    >
      <span className="relative flex h-10 w-10">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tomato/40" />
        <span className="relative inline-flex rounded-full h-10 w-10 bg-tomato/80" />
      </span>
      <p className="font-sans text-sm">{label}</p>
    </div>
  )
}
