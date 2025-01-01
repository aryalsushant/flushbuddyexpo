import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export default function ExploreScreen() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState({
    latitude: 31.3271,
    longitude: -89.3349,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Example destination (Student Union)
  const destination = {
    latitude: 31.3265,
    longitude: -89.3355,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      
      // Update region to show both current location and destination
      if (location) {
        setRegion({
          latitude: (location.coords.latitude + destination.latitude) / 2,
          longitude: (location.coords.longitude + destination.longitude) / 2,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
      >
        {/* Destination Marker */}
        <Marker
          coordinate={destination}
          title="Student Union Restroom"
          pinColor="blue"
        />
        
        {/* Route line between current location and destination */}
        {currentLocation && (
          <Polyline
            coordinates={[
              {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              },
              destination,
            ]}
            strokeColor="#007AFF"
            strokeWidth={3}
          />
        )}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});