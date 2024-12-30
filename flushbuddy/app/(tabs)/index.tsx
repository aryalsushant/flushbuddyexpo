import { StyleSheet, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView from 'react-native-maps';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      {/* Title Container */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Flushbuddy</ThemedText>
      </ThemedView>

      {/* Map container */}
      <View style={styles.mapContainer}>
      <MapView
      style={styles.map}
      initialRegion={{
      latitude: 31.3271,
      longitude: -89.3349,
      latitudeDelta: 0.01, // Reduced to zoom in closer to campus
      longitudeDelta: 0.01, // Reduced to zoom in closer to campus
  }}
/>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    marginTop: 40,
  },
  mapContainer: {
    height: 400,
    width: '100%',
  },
  map: {
    flex: 1,
  },
});