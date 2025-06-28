<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TravelHub - Your Ultimate Travel Companion</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌍 TravelHub</h1>
            <p>Your AI-powered travel companion for seamless booking and planning</p>
        </div>

        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('flights')">✈️ Flights</button>
            <button class="nav-tab" onclick="showTab('hotels')">🏨 Hotels</button>
            <button class="nav-tab" onclick="showTab('itinerary')">📅 AI Itinerary</button>
            <button class="nav-tab" onclick="showTab('edit-itinerary')">✏️ Edit Plans</button>
            <button class="nav-tab" onclick="showTab('hotel-search')">🔍 Find Hotels</button>
            <button class="nav-tab" onclick="showTab('attractions')">🗺️ Attractions</button>
        </div>

        <!-- Flights Tab -->
        <div id="flights" class="tab-content">
            <h2>✈️ Book Flight Tickets</h2>
            <form id="flight-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="from">From</label>
                        <input type="text" id="from" placeholder="Departure city" required>
                    </div>
                    <div class="form-group">
                        <label for="to">To</label>
                        <input type="text" id="to" placeholder="Destination city" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="departure">Departure Date</label>
                        <input type="date" id="departure" required>
                    </div>
                    <div class="form-group">
                        <label for="return">Return Date</label>
                        <input type="date" id="return">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="passengers">Passengers</label>
                        <select id="passengers">
                            <option value="1">1 Passenger</option>
                            <option value="2">2 Passengers</option>
                            <option value="3">3 Passengers</option>
                            <option value="4">4+ Passengers</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="class">Class</label>
                        <select id="class">
                            <option value="economy">Economy</option>
                            <option value="premium">Premium Economy</option>
                            <option value="business">Business</option>
                            <option value="first">First Class</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn">Search Flights</button>
            </form>
            <div id="flight-results" class="search-results"></div>
        </div>

        <!-- Hotels Tab -->
        <div id="hotels" class="tab-content hidden">
            <h2>🏨 Book Hotels</h2>
            <form id="hotel-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="hotel-destination">Destination</label>
                        <input type="text" id="hotel-destination" placeholder="City or hotel name" required>
                    </div>
                    <div class="form-group">
                        <label for="hotel-checkin">Check-in Date</label>
                        <input type="date" id="hotel-checkin" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="hotel-checkout">Check-out Date</label>
                        <input type="date" id="hotel-checkout" required>
                    </div>
                    <div class="form-group">
                        <label for="hotel-guests">Guests</label>
                        <select id="hotel-guests">
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4+ Guests</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="hotel-budget">Budget Range</label>
                    <select id="hotel-budget">
                        <option value="budget">Budget ($50-100/night)</option>
                        <option value="mid">Mid-range ($100-250/night)</option>
                        <option value="luxury">Luxury ($250+/night)</option>
                    </select>
                </div>
                <button type="submit" class="btn">Search Hotels</button>
            </form>
            <div id="hotel-results" class="search-results"></div>
        </div>

        <!-- AI Itinerary Tab -->
        <div id="itinerary" class="tab-content hidden">
            <h2>📅 AI-Powered Itinerary Planning</h2>
            <form id="itinerary-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="trip-destination">Destination</label>
                        <input type="text" id="trip-destination" placeholder="Where are you going?" required>
                    </div>
                    <div class="form-group">
                        <label for="trip-duration">Duration (days)</label>
                        <select id="trip-duration">
                            <option value="1">1 day</option>
                            <option value="3">3 days</option>
                            <option value="5">5 days</option>
                            <option value="7">1 week</option>
                            <option value="14">2 weeks</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="trip-interests">Interests</label>
                    <textarea id="trip-interests" rows="3" placeholder="What do you like to do? (museums, food, adventure, nightlife, history, etc.)"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="trip-budget">Budget</label>
                        <select id="trip-budget">
                            <option value="budget">Budget-friendly</option>
                            <option value="moderate">Moderate</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="trip-style">Travel Style</label>
                        <select id="trip-style">
                            <option value="relaxed">Relaxed</option>
                            <option value="moderate">Moderate</option>
                            <option value="packed">Action-packed</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn">Generate AI Itinerary</button>
            </form>
            <div id="itinerary-results" class="search-results"></div>
        </div>

        <!-- Edit Itinerary Tab -->
        <div id="edit-itinerary" class="tab-content hidden">
            <h2>✏️ Edit Your Itinerary</h2>
            <div class="ai-suggestion">
                <strong>💡 AI Tip:</strong> You can drag and drop activities to reorder them, or click edit to modify details!
            </div>
            <div id="editable-itinerary">
                <div class="itinerary-item">
                    <div class="time-slot">Day 1 - Morning (9:00 AM)</div>
                    <h4>Visit Central Park</h4>
                    <p>Start your day with a peaceful walk through Central Park. Visit Bethesda Fountain and enjoy the morning atmosphere.</p>
                    <div class="edit-controls">
                        <button onclick="editActivity(this)" style="background: #667eea; color: white;">Edit</button>
                        <button onclick="removeActivity(this)" style="background: #f5576c; color: white;">Remove</button>
                        <button onclick="moveActivity(this, 'up')" style="background: #28a745; color: white;">↑ Move Up</button>
                        <button onclick="moveActivity(this, 'down')" style="background: #28a745; color: white;">↓ Move Down</button>
                    </div>
                </div>
                <div class="itinerary-item">
                    <div class="time-slot">Day 1 - Afternoon (2:00 PM)</div>
                    <h4>Metropolitan Museum of Art</h4>
                    <p>Explore one of the world's greatest art museums. Don't miss the Egyptian collection and rooftop garden.</p>
                    <div class="edit-controls">
                        <button onclick="editActivity(this)" style="background: #667eea; color: white;">Edit</button>
                        <button onclick="removeActivity(this)" style="background: #f5576c; color: white;">Remove</button>
                        <button onclick="moveActivity(this, 'up')" style="background: #28a745; color: white;">↑ Move Up</button>
                        <button onclick="moveActivity(this, 'down')" style="background: #28a745; color: white;">↓ Move Down</button>
                    </div>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="addNewActivity()">+ Add New Activity</button>
        </div>

        <!-- Hotel Search Tab -->
        <div id="hotel-search" class="tab-content hidden">
            <h2>🔍 Find the Perfect Hotel</h2>
            <form id="advanced-hotel-search">
                <div class="form-row">
                    <div class="form-group">
                        <label for="search-location">Location</label>
                        <input type="text" id="search-location" placeholder="City, neighborhood, or landmark" required>
                    </div>
                    <div class="form-group">
                        <label for="search-price">Price Range</label>
                        <select id="search-price">
                            <option value="any">Any price</option>
                            <option value="under50">Under $50</option>
                            <option value="50-100">$50 - $100</option>
                            <option value="100-200">$100 - $200</option>
                            <option value="200-500">$200 - $500</option>
                            <option value="over500">$500+</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="search-rating">Minimum Rating</label>
                        <select id="search-rating">
                            <option value="any">Any rating</option>
                            <option value="3">3+ stars</option>
                            <option value="4">4+ stars</option>
                            <option value="5">5 stars only</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="search-amenities">Amenities</label>
                        <select id="search-amenities">
                            <option value="any">Any amenities</option>
                            <option value="pool">Swimming pool</option>
                            <option value="gym">Fitness center</option>
                            <option value="spa">Spa services</option>
                            <option value="business">Business center</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn">Search Hotels</button>
            </form>
            <div id="advanced-hotel-results" class="search-results"></div>
        </div>

        <!-- Attractions Tab -->
        <div id="attractions" class="tab-content hidden">
            <h2>🗺️ Discover Tourist Hotspots</h2>
            <form id="attractions-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="attraction-city">City</label>
                        <input type="text" id="attraction-city" placeholder="Which city to explore?" required>
                    </div>
                    <div class="form-group">
                        <label for="attraction-type">Type of Attraction</label>
                        <select id="attraction-type">
                            <option value="all">All attractions</option>
                            <option value="museums">Museums & Culture</option>
                            <option value="nature">Nature & Parks</option>
                            <option value="food">Food & Dining</option>
                            <option value="nightlife">Nightlife & Entertainment</option>
                            <option value="shopping">Shopping</option>
                            <option value="historic">Historic Sites</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn">Discover Attractions</button>
            </form>
            <div id="attractions-results" class="search-results"></div>
        </div>
    </div>

    <script src="main.js"></script>
</body>
</html>