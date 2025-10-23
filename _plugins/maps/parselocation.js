const parseLocation = (location) => {
  // TODO: Build parser for different location formats
  if (Array.isArray(location))
    return { latitude: location[0], longitude: location[1] };
  if (typeof location == 'object') {

    if (location.latitude && location.longitude)
      return location;

    if (location.lat && location.lng) {

      location.latitude = location.lat;
      location.longitude = location.lng;

      delete location.lat;
      delete location.lng;

      return location;
    }
    return null;
  }
}

export default parseLocation;