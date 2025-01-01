import { StyleSheet, View, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

const RESTROOM_LOCATIONS = [
  {
    id: '1',
    title: 'Liberal Arts Building Restroom',
    coordinate: {
      latitude: 31.3271,
      longitude: -89.3349,
    },
    rating: 4.5,
  },
  {
    id: '2',
    title: 'Library Restroom',
    coordinate: {
      latitude: 31.3280,
      longitude: -89.3340,
    },
    rating: 4.0,
  },
  {
    id: '3',
    title: 'Student Union Restroom',
    coordinate: {
      latitude: 31.3265,
      longitude: -89.3355,
    },
    rating: 3.5,
  },
];

type RestroomLocation = {
  id: string;
  title: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  rating: number;
};

export default function HomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState<RestroomLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      } catch (error) {
        setErrorMsg('Error getting location');
      }
    })();
  }, []);

  const handleMarkerPress = (location: RestroomLocation) => {
    setSelectedLocation(location);
  };

  const handleDirections = async () => {
    if (!currentLocation) {
      setErrorMsg('Waiting for current location...');
      return;
    }

    if (selectedLocation) {
      router.push({
        pathname: '/explore',
        params: {
          destLat: selectedLocation.coordinate.latitude,
          destLng: selectedLocation.coordinate.longitude,
          title: selectedLocation.title,
          sourceLat: currentLocation.coords.latitude,
          sourceLng: currentLocation.coords.longitude
        }
      });
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      {/* Title container */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Flushbuddy</ThemedText>
      </ThemedView>

      {/* Error message display */}
      {errorMsg && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
        </ThemedView>
      )}

      {/* Map container */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 31.3271,
            longitude: -89.3349,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {RESTROOM_LOCATIONS.map((location) => (
            <Marker
              key={location.id}
              identifier={location.id}
              coordinate={location.coordinate}
              title={location.title}
              onPress={() => handleMarkerPress(location)}
              tracksViewChanges={false}
              pinColor={selectedLocation?.id === location.id ? 'blue' : 'red'}
            />
          ))}
        </MapView>
      </View>

      {/* Information Card */}
      <ThemedView style={styles.infoCard}>
        {selectedLocation ? (
          <>
            <ThemedText type="title" style={styles.locationTitle}>
              {selectedLocation.title}
            </ThemedText>
            <ThemedText style={styles.rating}>
              Rating: {selectedLocation.rating} / 5
            </ThemedText>
            <Pressable
              style={[
                styles.directionsButton,
                !currentLocation && styles.directionsButtonDisabled
              ]}
              onPress={handleDirections}
              disabled={!currentLocation}
            >
              <ThemedText style={styles.buttonText}>
                {currentLocation ? 'Get Directions' : 'Getting Location...'}
              </ThemedText>
            </Pressable>
          </>
        ) : (
          <>
            <ThemedText type="title" style={styles.locationTitle}>
              Public Bathrooms in USM Hattiesburg Campus
            </ThemedText>
            <ThemedText style={styles.rating}>
              Click on a bathroom to start
            </ThemedText>
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    marginTop: 48,
  },
  mapContainer: {
    height: 475,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  infoCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  rating: {
    marginBottom: 16,
  },
  directionsButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  directionsButtonDisabled: {
    backgroundColor: '#999999',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});