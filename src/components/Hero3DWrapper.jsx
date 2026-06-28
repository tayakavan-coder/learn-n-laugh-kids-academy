import { lazy, Suspense } from 'react'

const Scene = lazy(() => import('./Hero3D'))

export default function Hero3DWrapper() {
  return (
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  )
}
