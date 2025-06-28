const mockData = {
  flights: [
    {
      id: 'FL001',
      from: 'New York',
      to: 'London',
      airline: 'SkyWings',
      departure: '08:00 AM',
      arrival: '08:00 PM',
      duration: '7h 00m',
      basePrice: 650,
      aircraft: 'Boeing 777'
    },
    {
      id: 'FL002',
      from: 'New York',
      to: 'London',
      airline: 'Atlantic Air',
      departure: '02:30 PM',
      arrival: '02:30 AM+1',
      duration: '7h 00m',
      basePrice: 580,
      aircraft: 'Airbus A350'
    },
    {
      id: 'FL003',
      from: 'London',
      to: 'Paris',
      airline: 'EuroJet',
      departure: '10:15 AM',
      arrival: '12:30 PM',
      duration: '1h 15m',
      basePrice: 120,
      aircraft: 'Airbus A320'
    },
    {
      id: 'FL004',
      from: 'New York',
      to: 'Tokyo',
      airline: 'Pacific Airways',
      departure: '11:00 PM',
      arrival: '05:30 PM+1',
      duration: '13h 30m',
      basePrice: 1200,
      aircraft: 'Boeing 787'
    },
    {
      id: 'FL005',
      from: 'Los Angeles',
      to: 'Tokyo',
      airline: 'Pacific Airways',
      departure: '01:00 PM',
      arrival: '06:30 PM+1',
      duration: '11h 30m',
      basePrice: 1100,
      aircraft: 'Boeing 777'
    },
    {
      id: 'FL006',
      from: 'Paris',
      to: 'Rome',
      airline: 'EuroJet',
      departure: '03:45 PM',
      arrival: '05:20 PM',
      duration: '2h 35m',
      basePrice: 150,
      aircraft: 'Airbus A319'
    }
  ],

  hotels: [
    {
      id: 'HT001',
      name: 'Grand Plaza Hotel',
      city: 'London',
      rating: 4.5,
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
      basePrice: 180,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 'HT002',
      name: 'Budget Inn London',
      city: 'London',
      rating: 3.8,
      amenities: ['WiFi', 'Breakfast'],
      basePrice: 85,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 'HT003',
      name: 'Luxury Suites Paris',
      city: 'Paris',
      rating: 4.8,
      amenities: ['WiFi', 'Spa', 'Room Service', 'Concierge'],
      basePrice: 320,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 'HT004',
      name: 'Tokyo Business Hotel',
      city: 'Tokyo',
      rating: 4.2,
      amenities: ['WiFi', 'Business Center', 'Restaurant'],
      basePrice: 160,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 'HT005',
      name: 'Boutique Hotel Paris',
      city: 'Paris',
      rating: 4.3,
      amenities: ['WiFi', 'Restaurant', 'Bar'],
      basePrice: 210,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 'HT006',
      name: 'Traditional Ryokan Tokyo',
      city: 'Tokyo',
      rating: 4.7,
      amenities: ['WiFi', 'Traditional Baths', 'Garden'],
      basePrice: 280,
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 'HT007',
      name: 'Colosseum View Hotel',
      city: 'Rome',
      rating: 4.4,
      amenities: ['WiFi', 'Rooftop Terrace', 'Restaurant'],
      basePrice: 195,
      image: 'https://via.placeholder.com/300x200'
    }
  ],

  touristHotspots: [
    {
      id: 'HS001',
      name: 'Tower of London',
      city: 'London',
      category: 'Historical',
      rating: 4.6,
      description: 'Historic castle on the Thames with Crown Jewels display',
      estimatedVisitTime: '3 hours',
      entryFee: 25
    },
    {
      id: 'HS002',
      name: 'British Museum',
      city: 'London',
      category: 'Museum',
      rating: 4.7,
      description: 'World-famous museum with artifacts from around the globe',
      estimatedVisitTime: '4 hours',
      entryFee: 0
    },
    {
      id: 'HS003',
      name: 'London Eye',
      city: 'London',
      category: 'Entertainment',
      rating: 4.4,
      description: 'Giant observation wheel offering panoramic city views',
      estimatedVisitTime: '1 hour',
      entryFee: 35
    },
    {
      id: 'HS004',
      name: 'Westminster Abbey',
      city: 'London',
      category: 'Religious',
      rating: 4.5,
      description: 'Gothic abbey church and UNESCO World Heritage Site',
      estimatedVisitTime: '2 hours',
      entryFee: 27
    },
    {
      id: 'HS005',
      name: 'Eiffel Tower',
      city: 'Paris',
      category: 'Landmark',
      rating: 4.8,
      description: 'Iconic iron tower and symbol of Paris',
      estimatedVisitTime: '2 hours',
      entryFee: 29
    },
    {
      id: 'HS006',
      name: 'Louvre Museum',
      city: 'Paris',
      category: 'Museum',
      rating: 4.7,
      description: 'World\'s largest art museum featuring the Mona Lisa',
      estimatedVisitTime: '5 hours',
      entryFee: 17
    },
    {
      id: 'HS007',
      name: 'Notre-Dame Cathedral',
      city: 'Paris',
      category: 'Religious',
      rating: 4.6,
      description: 'Gothic masterpiece cathedral on the Île de la Cité',
      estimatedVisitTime: '1.5 hours',
      entryFee: 0
    },
    {
      id: 'HS008',
      name: 'Arc de Triomphe',
      city: 'Paris',
      category: 'Landmark',
      rating: 4.5,
      description: 'Triumphal arch honoring those who fought for France',
      estimatedVisitTime: '1 hour',
      entryFee: 13
    },
    {
      id: 'HS009',
      name: 'Senso-ji Temple',
      city: 'Tokyo',
      category: 'Religious',
      rating: 4.5,
      description: 'Ancient Buddhist temple in Asakusa district',
      estimatedVisitTime: '2 hours',
      entryFee: 0
    },
    {
      id: 'HS010',
      name: 'Tokyo Skytree',
      city: 'Tokyo',
      category: 'Entertainment',
      rating: 4.3,
      description: 'Tallest tower in Japan with observation decks',
      estimatedVisitTime: '2 hours',
      entryFee: 40
    },
    {
      id: 'HS011',
      name: 'Meiji Shrine',
      city: 'Tokyo',
      category: 'Religious',
      rating: 4.4,
      description: 'Shinto shrine surrounded by a forest in the heart of Tokyo',
      estimatedVisitTime: '2 hours',
      entryFee: 0
    },
    {
      id: 'HS012',
      name: 'Tsukiji Outer Market',
      city: 'Tokyo',
      category: 'Food & Culture',
      rating: 4.2,
      description: 'Famous fish market with fresh sushi and street food',
      estimatedVisitTime: '3 hours',
      entryFee: 0
    },
    {
      id: 'HS013',
      name: 'Colosseum',
      city: 'Rome',
      category: 'Historical',
      rating: 4.8,
      description: 'Ancient amphitheater and iconic symbol of Rome',
      estimatedVisitTime: '3 hours',
      entryFee: 18
    },
    {
      id: 'HS014',
      name: 'Vatican Museums',
      city: 'Rome',
      category: 'Museum',
      rating: 4.6,
      description: 'Papal palaces housing Renaissance art and the Sistine Chapel',
      estimatedVisitTime: '4 hours',
      entryFee: 20
    },
    {
      id: 'HS015',
      name: 'Trevi Fountain',
      city: 'Rome',
      category: 'Landmark',
      rating: 4.5,
      description: 'Baroque fountain where tradition says to throw a coin',
      estimatedVisitTime: '30 minutes',
      entryFee: 0
    },
    {
      id: 'HS016',
      name: 'Roman Forum',
      city: 'Rome',
      category: 'Historical',
      rating: 4.4,
      description: 'Ancient center of Roman public life with ruins and temples',
      estimatedVisitTime: '2.5 hours',
      entryFee: 16
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = mockData;
}