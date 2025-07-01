class ItineraryService {
  static generateItinerary(destination, startDate, endDate) {
    const itinerary = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    let currentDate = new Date(start);

    const possibleActivities = this.getActivitiesForDestination(destination);

    while (currentDate <= end) {
      const activities = [];
      const availableActivities = [...possibleActivities];
      
      // Generate 2-3 activities per day
      const activitiesPerDay = Math.min(3, availableActivities.length);
      
      for (let i = 0; i < activitiesPerDay; i++) {
        if (availableActivities.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * availableActivities.length);
        activities.push(availableActivities.splice(randomIndex, 1)[0]);
      }

      itinerary.push({
        date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD
        activities: activities,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return itinerary;
  }

  static getActivitiesForDestination(destination) {
    const activities = {
      'LAX': [
        { name: 'Hollywood Walk of Fame', time: 'Morning', location: 'Hollywood Blvd' },
        { name: 'Griffith Observatory', time: 'Afternoon', location: 'Griffith Park' },
        { name: 'Santa Monica Pier', time: 'Evening', location: 'Santa Monica' },
        { name: 'Getty Center', time: 'Morning', location: 'Brentwood' },
        { name: 'Venice Beach', time: 'Afternoon', location: 'Venice' },
        { name: 'Rodeo Drive', time: 'Morning', location: 'Beverly Hills' }
      ],
      'SFX': [
        { name: 'Golden Gate Bridge', time: 'Morning', location: 'Golden Gate' },
        { name: 'Alcatraz Island Tour', time: 'Afternoon', location: 'Alcatraz' },
        { name: 'Fisherman\'s Wharf', time: 'Evening', location: 'Pier 39' },
        { name: 'Lombard Street', time: 'Morning', location: 'Russian Hill' },
        { name: 'Chinatown', time: 'Afternoon', location: 'Downtown' },
        { name: 'Union Square', time: 'Evening', location: 'Downtown' }
      ],
      'MIA': [
        { name: 'South Beach', time: 'Morning', location: 'Miami Beach' },
        { name: 'Art Deco Historic District Tour', time: 'Afternoon', location: 'South Beach' },
        { name: 'Everglades National Park', time: 'Full Day', location: 'Everglades' },
        { name: 'Wynwood Walls', time: 'Morning', location: 'Wynwood' },
        { name: 'Little Havana', time: 'Afternoon', location: 'Calle Ocho' },
        { name: 'Bayside Marketplace', time: 'Evening', location: 'Downtown Miami' }
      ],
      'PAR': [
        { name: 'Eiffel Tower', time: 'Morning', location: 'Champ de Mars' },
        { name: 'Louvre Museum', time: 'Afternoon', location: 'Louvre' },
        { name: 'Seine River Cruise', time: 'Evening', location: 'Seine' },
        { name: 'Notre Dame Cathedral', time: 'Morning', location: 'Île de la Cité' },
        { name: 'Montmartre & Sacré-Cœur', time: 'Afternoon', location: 'Montmartre' },
        { name: 'Champs-Élysées', time: 'Evening', location: 'Arc de Triomphe' }
      ]
    };

    return activities[destination.toUpperCase()] || [
      { name: 'Explore City Center', time: 'Morning', location: 'Downtown' },
      { name: 'Visit Local Park', time: 'Afternoon', location: 'City Park' },
      { name: 'Enjoy Local Cuisine', time: 'Evening', location: 'Restaurant District' }
    ];
  }

  static getTouristRecommendations(destination) {
    const recommendations = {
      'LAX': {
        touristDestinations: ['Universal Studios Hollywood', 'Getty Center', 'Disneyland Park'],
        fastestRoute: 'From Downtown LA: Take Metro Red Line to Universal City/Studio City Station (approx. 20 min).',
        localTips: ['Use Metro for cost-effective transport', 'Visit beaches in the afternoon', 'Hollywood tours are best in morning']
      },
      'SFX': {
        touristDestinations: ['Pier 39', 'Lombard Street', 'Chinatown'],
        fastestRoute: 'From Union Square: Take Powell-Hyde Cable Car to Lombard Street (approx. 15 min).',
        localTips: ['Dress in layers for weather changes', 'Cable cars get crowded after 10am', 'Book Alcatraz tickets in advance']
      },
      'MIA': {
        touristDestinations: ['Vizcaya Museum & Gardens', 'Wynwood Walls', 'Little Havana'],
        fastestRoute: 'From South Beach: Take the free trolley to Lincoln Road Mall, then taxi/ride-share (approx. 20 min).',
        localTips: ['Best beach time is morning', 'Nightlife starts late', 'Try Cuban coffee in Little Havana']
      },
      'PAR': {
        touristDestinations: ['Champs-Élysées', 'Arc de Triomphe', 'Musée d\'Orsay'],
        fastestRoute: 'From Eiffel Tower: Take Metro Line 9 from Trocadéro to Franklin D. Roosevelt for Champs-Élysées (approx. 10 min).',
        localTips: ['Museums are free first Sunday of month', 'Metro day passes save money', 'Book restaurant reservations in advance']
      }
    };

    return recommendations[destination.toUpperCase()] || {
      touristDestinations: ['Local Market', 'Botanical Garden', 'Historic District'],
      fastestRoute: 'Walk or use public transport, check local transit apps for real-time data.',
      localTips: ['Ask locals for hidden gems', 'Try local specialties', 'Respect local customs']
    };
  }
}

module.exports = ItineraryService;
