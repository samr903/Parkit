function initAutocomplete() {
	//St Lucia Settings
	//center: new google.maps.LatLng(-27.495738, 153.011882),
	//zoom: 16
	//
	
	//Initialises the google maps object
	var map = new google.maps.Map(document.getElementById('map'), {
		
		center: {lat: -33.8688, lng: 151.2195},
		zoom: 13,
		mapTypeId: 'roadmap',
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: true,
		streetViewControl: false,
		rotateControl: true,
		fullscreenControl: true

	});

	var infoWindow = new google.maps.InfoWindow;

	//Reads the XML File and gathers column data for each parking space entry
	downloadUrl('https://storage.googleapis.com/mapsdevsite/json/mapmarkers2.xml', function(data) {
		var xml = data.responseXML;
		var markers = xml.documentElement.getElementsByTagName('marker');
		Array.prototype.forEach.call(markers, function(markerElem) {
		var id = markerElem.getAttribute('id');
		var name = markerElem.getAttribute('name');
		var address = markerElem.getAttribute('address');
		var type = markerElem.getAttribute('type');
		var point = new google.maps.LatLng(
		  parseFloat(markerElem.getAttribute('lat')),
		  parseFloat(markerElem.getAttribute('lng')));

		
		//Sets styling for the content window on marker click
		var infowincontent = document.createElement('div');
		var strong = document.createElement('strong');
		strong.textContent = name
		infowincontent.appendChild(strong);
		infowincontent.appendChild(document.createElement('br'));

		var text = document.createElement('text');
		text.textContent = address
		infowincontent.appendChild(text);
		
		//Draws the marker to the map
		var marker = new google.maps.Marker({
			map: map,
			position: point,
		});
		
		//Creates an event listener for markers drawn
		marker.addListener('click', function() {
			infoWindow.setContent(infowincontent);
			infoWindow.open(map, marker);
		});
		});
	});

	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
	  searchBox.setBounds(map.getBounds());
	});

	var markers = [];
	
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
	  var places = searchBox.getPlaces();

	  if (places.length == 0) {
		return;
	  }

	  // Clear out the old markers.
	  markers.forEach(function(marker) {
		marker.setMap(null);
	  });
	  markers = [];

	  // For each place, get the icon, name and location.
	  var bounds = new google.maps.LatLngBounds();
	  places.forEach(function(place) {
		if (!place.geometry) {
		  console.log("Returned place contains no geometry");
		  return;
		}
		var icon = {
		  url: place.icon,
		  size: new google.maps.Size(71, 71),
		  origin: new google.maps.Point(0, 0),
		  anchor: new google.maps.Point(17, 34),
		  scaledSize: new google.maps.Size(25, 25)
		};

		// Create a marker for each place.
		markers.push(new google.maps.Marker({
		  map: map,
		  icon: icon,
		  title: place.name,
		  position: place.geometry.location
		}));

		if (place.geometry.viewport) {
		  // Only geocodes have viewport.
		  bounds.union(place.geometry.viewport);
		} else {
		  bounds.extend(place.geometry.location);
		}
	  });
	  map.fitBounds(bounds);
	});
	}

//Settings for the XML Request
function downloadUrl(url, callback) {
var request = window.ActiveXObject ?
	new ActiveXObject('Microsoft.XMLHTTP') :
	new XMLHttpRequest;

request.onreadystatechange = function() {
  if (request.readyState == 4) {
	request.onreadystatechange = doNothing;
	callback(request, request.status);
  }
};

request.open('GET', url, true);
request.send(null);
}

function doNothing() {}