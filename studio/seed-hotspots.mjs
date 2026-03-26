import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'tivw2iwp',
  dataset: 'production',
  apiVersion: '2025-03-25',
  useCdn: false,
  token: process.env.SANITY_TOKEN
})

const hotspots = [
  {_key: 'hs1', _type: 'hotspot', number: 1, positionX: 20, positionY: 25, label: 'Walkin Mews', description: 'Pedestrian-friendly walkways connecting residential units.'},
  {_key: 'hs2', _type: 'hotspot', number: 2, positionX: 75, positionY: 30, label: 'Backyard with Hot Tubs', description: 'Private outdoor spaces with hot tubs for relaxation.'},
  {_key: 'hs3', _type: 'hotspot', number: 3, positionX: 15, positionY: 50, label: '3-Storey Townhomes', description: 'Spacious three-storey townhome residences.'},
  {_key: 'hs4', _type: 'hotspot', number: 4, positionX: 30, positionY: 75, label: 'At-Grade Garage', description: 'Convenient ground-level parking.'},
  {_key: 'hs5', _type: 'hotspot', number: 5, positionX: 50, positionY: 45, label: 'Seating / Child\'s Play', description: 'Family-friendly outdoor area with seating and play space.'},
  {_key: 'hs6', _type: 'hotspot', number: 6, positionX: 80, positionY: 20, label: 'Rooftop Restaurant Patio', description: 'Elevated dining with panoramic Whistler views.'},
  {_key: 'hs7', _type: 'hotspot', number: 7, positionX: 50, positionY: 60, label: 'The Plaza', description: 'Central gathering space and community hub.'},
  {_key: 'hs8', _type: 'hotspot', number: 8, positionX: 40, positionY: 90, label: 'Site Entry / Valley Trail Connection', description: 'Main entrance with Valley Trail access.'},
  {_key: 'hs9', _type: 'hotspot', number: 9, positionX: 85, positionY: 50, label: 'Residential Amenities', description: 'Premium amenities with mountain views.'}
]

try {
  const result = await client
    .patch('10de3789-a0fb-4366-8979-221dcd91aed1')
    .set({'pageBuilder[_key=="27705f996f90"].hotspots': hotspots})
    .commit()
  
  console.log('Patched successfully:', result._id)
} catch (error) {
  console.error('Error:', error.message)
}
