import type { JourneyRegionView } from '../../types/journey'
import { JourneyRegionNode } from './JourneyRegionNode'

export function JourneyMap({ regions, selectedId, onSelect }: {
  regions: JourneyRegionView[]
  selectedId: string | null
  onSelect: (region: JourneyRegionView) => void
}) {
  return <section className="journey-map" aria-label="Mapa da Jornada">
    <div className="journey-map-stars" />
    <div className="journey-route">
      {regions.map((region, index) => <div className="journey-route-step" key={region.id}>
        <JourneyRegionNode region={region} selected={selectedId === region.id} onSelect={() => onSelect(region)} />
        {index < regions.length - 1 && <span className={`journey-route-line ${region.state === 'completed' ? 'completed' : ''}`} />}
      </div>)}
    </div>
  </section>
}
