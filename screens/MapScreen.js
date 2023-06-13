import * as React from 'react';
import * as Location from 'expo-location';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '@env';

export default function MapScreen({ navigation }) {
    const [origin, setOrigin] = React.useState({
        latitude: 50.426793,
        longitude: 30.563402,
    });

    const [destination, setDestination] = React.useState({
        latitude: 50.426793,
        longitude: 30.563402,
    });

    React.useEffect(() => {
        getLocationPermission();
    }, []);

    async function getLocationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Дозвіл відхилено');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const current = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
        setOrigin(current);
    }

    const calculateDistance = () => {
        const R = 6371; // Earth's radius in km
        const lat1 = origin.latitude;
        const lon1 = origin.longitude;
        const lat2 = destination.latitude;
        const lon2 = destination.longitude;

        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in km
        return distance;
    };

    const isNearby = calculateDistance() <= 0.1;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04,
                }}
            >
                <Marker
                    draggable
                    coordinate={origin}
                    onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
                />
                <Marker
                    draggable
                    coordinate={destination}
                    onDragEnd={(direction) =>
                        setDestination(direction.nativeEvent.coordinate)
                    }
                />
                <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={API_KEY}
                    strokeColor="rgba(103, 103, 103, 1)"
                    strokeWidth={5}
                />
            </MapView>
            {isNearby && (
                <View style={styles.messageContainer}>
                    <Text style={styles.message}>Ви знаходитесь близько до пристрою.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    messageContainer: {
        position: 'absolute',
        top: '15%',
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    message: {
        fontSize: 21,
        textAlign: 'center',
    },
});
