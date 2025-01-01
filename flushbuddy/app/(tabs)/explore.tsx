import { StyleSheet, Linking, Platform, Button } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const { destLat, destLng, title } = params;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState({
    latitude: Number(destLat) || 31.3271,
    longitude: Number(destLng) || -89.3349,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const openInMaps = async () => {
    if (!currentLocation) {
      setErrorMsg('Waiting for current location...');
      return;
    }

    const scheme = Platform.select({ ios: 'maps:0,0?saddr=', android: 'geo:0,0?q=' });
    const latLng = `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
    const destination = `${destLat},${destLng}`;
    const label = encodeURIComponent(title as string);
    const url = Platform.select({
      ios: `${scheme}${latLng}&daddr=${destination}&q=${label}`,
      android: `${scheme}${destination}(${label})`
    });

    if (url) {
      try {
        await Linking.openURL(url);
      } catch (error) {
        setErrorMsg('Could not open maps application');
      }
    }
  };

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
        
        // Update region to show both current location and destination
        if (location) {
          setRegion({
            latitude: (location.coords.latitude + Number(destLat)) / 2,
            longitude: (location.coords.longitude + Number(destLng)) / 2,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        setErrorMsg('Error getting location');
      }
    })();
  }, [destLat, destLng]);

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
      >
        {/* Destination Marker */}
        <Marker
          coordinate={{
            latitude: Number(destLat),
            longitude: Number(destLng),
          }}
          title={title as string}
          pinColor="blue"
        />
      </MapView>

      {/* Error message display */}
      {errorMsg && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
        </ThemedView>
      )}

      {/* Navigation button */}
      <ThemedView style={styles.buttonContainer}>
        <Button
          title="Open in Maps"
          onPress={openInMaps}
        />
      </ThemedView>
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
  errorContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  }
});