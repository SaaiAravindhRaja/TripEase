// TravelHub JavaScript Functionality

// Tab switching functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.add('hidden'));
    
    // Remove active class from all nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }
    
    // Add active class to clicked nav tab
    const activeNavTab = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeNavTab) {
        activeNavTab.classList.add('active');
    }
}

// Flight search functionality
document.addEventListener('DOMContentLoaded', function() {
    const flightForm = document.getElementById('flight-form');
    if (flightForm) {
        flightForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchFlights();
        });
    }
    
    const hotelForm = document.getElementById('hotel-form');
    if (hotelForm) {
        hotelForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchHotels();
        });
    }
    
    const itineraryForm = document.getElementById('itinerary-form');
    if (itineraryForm) {
        itineraryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateItinerary();
        });
    }
    
    const advancedHotelForm = document.getElementById('advanced-hotel-search');
    if (advancedHotelForm) {
        advancedHotelForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchAdvancedHotels();
        });
    }
    
    const attractionsForm = document.getElementById('attractions-form');
    if (attractionsForm) {
        attractionsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchAttractions();
        });
    }
});

function searchFlights() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departure = document.getElementById('departure').value;
    const returnDate = document.getElementById('return').value;
    const passengers = document.getElementById('passengers').value;
    const classType = document.getElementById('class').value;
    
    const resultsDiv = document.getElementById('flight-results');
    
    // Simulate flight search results
    const flights = [
        {
            airline: 'SkyAir',
            departure: '10:00 AM',
            arrival: '2:30 PM',
            price: '$299',
            duration: '4h 30m',
            stops: 'Direct'
        },
        {
            airline: 'GlobalWings',
            departure: '2:15 PM',
            arrival: '6:45 PM',
            price: '$245',
            duration: '4h 30m',
            stops: '1 stop'
        },
        {
            airline: 'PremiumAir',
            departure: '8:30 AM',
            arrival: '1:00 PM',
            price: '$450',
            duration: '4h 30m',
            stops: 'Direct'
        }
    ];
    
    let html = '<h3>Available Flights</h3>';
    flights.forEach(flight => {
        html += `
            <div class="result-item">
                <div class="flight-info">
                    <h4>${flight.airline}</h4>
                    <div class="flight-details">
                        <span>${flight.departure} - ${flight.arrival}</span>
                        <span>${flight.duration} • ${flight.stops}</span>
                    </div>
                </div>
                <div class="flight-price">
                    <span class="price">${flight.price}</span>
                    <button class="btn btn-small">Select</button>
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

function searchHotels() {
    const destination = document.getElementById('hotel-destination').value;
    const checkin = document.getElementById('hotel-checkin').value;
    const checkout = document.getElementById('hotel-checkout').value;
    const guests = document.getElementById('hotel-guests').value;
    const budget = document.getElementById('hotel-budget').value;
    
    const resultsDiv = document.getElementById('hotel-results');
    
    // Simulate hotel search results
    const hotels = [
        {
            name: 'Grand Plaza Hotel',
            rating: 4.5,
            price: '$120/night',
            amenities: ['WiFi', 'Pool', 'Gym'],
            location: 'Downtown'
        },
        {
            name: 'Comfort Inn Express',
            rating: 3.8,
            price: '$85/night',
            amenities: ['WiFi', 'Breakfast'],
            location: 'Airport Area'
        },
        {
            name: 'Luxury Resort & Spa',
            rating: 4.9,
            price: '$350/night',
            amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
            location: 'Beachfront'
        }
    ];
    
    let html = '<h3>Available Hotels</h3>';
    hotels.forEach(hotel => {
        html += `
            <div class="result-item">
                <div class="hotel-info">
                    <h4>${hotel.name}</h4>
                    <div class="hotel-details">
                        <span>⭐ ${hotel.rating} • ${hotel.location}</span>
                        <span>${hotel.amenities.join(' • ')}</span>
                    </div>
                </div>
                <div class="hotel-price">
                    <span class="price">${hotel.price}</span>
                    <button class="btn btn-small">Book Now</button>
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

function generateItinerary() {
    const destination = document.getElementById('trip-destination').value;
    const duration = document.getElementById('trip-duration').value;
    const interests = document.getElementById('trip-interests').value;
    const budget = document.getElementById('trip-budget').value;
    const style = document.getElementById('trip-style').value;
    
    const resultsDiv = document.getElementById('itinerary-results');
    
    // Simulate AI-generated itinerary
    const itinerary = {
        destination: destination,
        duration: duration,
        days: []
    };
    
    for (let i = 1; i <= parseInt(duration); i++) {
        itinerary.days.push({
            day: i,
            activities: [
                {
                    time: '9:00 AM',
                    activity: 'Breakfast at local café',
                    description: 'Start your day with authentic local cuisine'
                },
                {
                    time: '10:30 AM',
                    activity: 'Visit main attractions',
                    description: 'Explore the most popular tourist spots'
                },
                {
                    time: '2:00 PM',
                    activity: 'Lunch break',
                    description: 'Try local specialties at recommended restaurants'
                },
                {
                    time: '4:00 PM',
                    activity: 'Cultural experience',
                    description: 'Immerse yourself in local culture and traditions'
                },
                {
                    time: '7:00 PM',
                    activity: 'Dinner and nightlife',
                    description: 'Enjoy evening entertainment and dining'
                }
            ]
        });
    }
    
    let html = `<h3>Your ${duration}-Day Itinerary for ${destination}</h3>`;
    html += '<div class="itinerary-container">';
    
    itinerary.days.forEach(day => {
        html += `<div class="day-plan"><h4>Day ${day.day}</h4>`;
        day.activities.forEach(activity => {
            html += `
                <div class="activity">
                    <span class="time">${activity.time}</span>
                    <div class="activity-details">
                        <h5>${activity.activity}</h5>
                        <p>${activity.description}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

function searchAdvancedHotels() {
    const location = document.getElementById('search-location').value;
    const price = document.getElementById('search-price').value;
    const rating = document.getElementById('search-rating').value;
    const amenities = document.getElementById('search-amenities').value;
    
    const resultsDiv = document.getElementById('advanced-hotel-results');
    
    // Simulate advanced hotel search
    const hotels = [
        {
            name: 'Business Center Hotel',
            rating: 4.2,
            price: '$180/night',
            amenities: ['WiFi', 'Business Center', 'Gym'],
            location: 'Business District'
        },
        {
            name: 'Spa Resort & Wellness',
            rating: 4.7,
            price: '$280/night',
            amenities: ['WiFi', 'Spa', 'Pool', 'Restaurant'],
            location: 'Resort Area'
        }
    ];
    
    let html = '<h3>Advanced Hotel Search Results</h3>';
    hotels.forEach(hotel => {
        html += `
            <div class="result-item">
                <div class="hotel-info">
                    <h4>${hotel.name}</h4>
                    <div class="hotel-details">
                        <span>⭐ ${hotel.rating} • ${hotel.location}</span>
                        <span>${hotel.amenities.join(' • ')}</span>
                    </div>
                </div>
                <div class="hotel-price">
                    <span class="price">${hotel.price}</span>
                    <button class="btn btn-small">View Details</button>
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

function searchAttractions() {
    const city = document.getElementById('attraction-city').value;
    const type = document.getElementById('attraction-type').value;
    
    const resultsDiv = document.getElementById('attractions-results');
    
    // Simulate attractions search
    const attractions = [
        {
            name: 'City Museum',
            type: 'Museums & Culture',
            rating: 4.6,
            description: 'Explore local history and culture',
            price: 'Free'
        },
        {
            name: 'Central Park',
            type: 'Nature & Parks',
            rating: 4.8,
            description: 'Beautiful green space for relaxation',
            price: 'Free'
        },
        {
            name: 'Historic District',
            type: 'Historic Sites',
            rating: 4.4,
            description: 'Walk through centuries of history',
            price: '$15'
        }
    ];
    
    let html = `<h3>Top Attractions in ${city}</h3>`;
    attractions.forEach(attraction => {
        html += `
            <div class="result-item">
                <div class="attraction-info">
                    <h4>${attraction.name}</h4>
                    <div class="attraction-details">
                        <span>⭐ ${attraction.rating} • ${attraction.type}</span>
                        <p>${attraction.description}</p>
                    </div>
                </div>
                <div class="attraction-price">
                    <span class="price">${attraction.price}</span>
                    <button class="btn btn-small">Learn More</button>
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

// Itinerary editing functions
function editActivity(button) {
    const item = button.closest('.itinerary-item');
    const title = item.querySelector('h4').textContent;
    const description = item.querySelector('p').textContent;
    
    const newTitle = prompt('Edit activity title:', title);
    const newDescription = prompt('Edit activity description:', description);
    
    if (newTitle && newDescription) {
        item.querySelector('h4').textContent = newTitle;
        item.querySelector('p').textContent = newDescription;
    }
}

function removeActivity(button) {
    if (confirm('Are you sure you want to remove this activity?')) {
        button.closest('.itinerary-item').remove();
    }
}

function moveActivity(button, direction) {
    const item = button.closest('.itinerary-item');
    const container = item.parentElement;
    
    if (direction === 'up' && item.previousElementSibling) {
        container.insertBefore(item, item.previousElementSibling);
    } else if (direction === 'down' && item.nextElementSibling) {
        container.insertBefore(item.nextElementSibling, item);
    }
}

function addNewActivity() {
    const container = document.getElementById('editable-itinerary');
    const newItem = document.createElement('div');
    newItem.className = 'itinerary-item';
    
    const title = prompt('Enter activity title:');
    const description = prompt('Enter activity description:');
    const time = prompt('Enter time (e.g., Day 1 - Morning (9:00 AM)):');
    
    if (title && description && time) {
        newItem.innerHTML = `
            <div class="time-slot">${time}</div>
            <h4>${title}</h4>
            <p>${description}</p>
            <div class="edit-controls">
                <button onclick="editActivity(this)" style="background: #667eea; color: white;">Edit</button>
                <button onclick="removeActivity(this)" style="background: #f5576c; color: white;">Remove</button>
                <button onclick="moveActivity(this, 'up')" style="background: #28a745; color: white;">↑ Move Up</button>
                <button onclick="moveActivity(this, 'down')" style="background: #28a745; color: white;">↓ Move Down</button>
            </div>
        `;
        container.appendChild(newItem);
    }
} 