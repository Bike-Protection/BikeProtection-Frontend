import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Button, ImageBackground, Text} from 'react-native';
import {THEME} from '../src/Theme';
import BleManager from 'react-native-ble-manager';

const MainScreen = ({navigation}) => {
    const localImage = require('../assets/fon3.png');
    const [changeColor, setChangeColor] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [deviceConnected, setDeviceConnected] = useState(false);
    const [bleError, setBleError] = useState('');

    useEffect(() => {
        BleManager.start({ showAlert: false }).then(() => {
            const subscription = BleManagerEmitter.addListener(
                'BleManagerDidUpdateState',
                ({ state }) => {
                    if (state === 'PoweredOn') {
                        scanAndConnectToDevice();
                    }
                }
            );

            // Clean up the subscription when the component unmounts
            return () => {
                subscription.remove();
                disconnectFromDevice();
            };
        });
    }, []);


    const scanAndConnectToDevice = () => {
        BleManager.scan([], 5, true)
            .then((results) => {
                const device = results.find((result) => result.name === 'YourDeviceName'); //треба змінити на назву пристрою
                if (device) {
                    BleManager.stopScan();
                    connectToDevice(device);
                }
            })
            .catch((error) => {
                console.error('Scan error:', error);
            });
    };

    const connectToDevice = (device) => {
        BleManager.connect(device.id)
            .then(() => {
                console.log('Connected to device:', device);
                setDeviceConnected(true);
            })
            .catch((error) => {
                console.error('Connection error:', error);
                setBleError('Failed to connect to device');
            });
    };

    const disconnectFromDevice = () => {
        BleManager.disconnect(device.id)
            .then(() => {
                console.log('Disconnected from device');
                setDeviceConnected(false);
            })
            .catch((error) => {
                console.error('Disconnection error:', error);
            });
    };

    const sendDataToArduino = (data) => {
        const serviceUUID = 'YOUR_SERVICE_UUID'; //треба замінити (зазвичай визначаються в коді Arduino)
        const characteristicUUID = 'YOUR_CHARACTERISTIC_UUID'; //треба замінити (зазвичай визначаються в коді Arduino)
        const value = Buffer.from(data, 'utf-8');

        BleManager.write(device.id, serviceUUID, characteristicUUID, value.toString('base64'))
            .then(() => {
                console.log('Data sent to Arduino:', data);
            })
            .catch((error) => {
                console.error('Error sending data to Arduino:', error);
            });
    };

    const onPressHandler = () => {
        setBlocked(!blocked);
        setChangeColor(!changeColor);

        const data = blocked ? 'BLOCK' : 'UNBLOCK';
        sendDataToArduino(data);
    };

    return (
        <View style={{flex: 1}}>
            <View>
                <ImageBackground source={localImage} style={styles.image}/>
                <View style={styles.eclipse}/>

                <View style={styles.viewText}>
                    {blocked ? (
                        <Text style={styles.text}>Пристрій заблоковано</Text>
                    ) : (
                        <Text style={styles.text}>Пристрій розблоковано</Text>
                    )}
                </View>
                <View style={styles.buttons}>
                    <Button
                        title={blocked ? 'Розблокувати' : 'Заблокувати'}
                        onPress={onPressHandler}
                        color={blocked ? THEME.GREEN_COLOR : THEME.RED_COLOR}
                        disabled={!deviceConnected || bleError !== ''}
                    />
                    {bleError !== '' && <Text style={styles.errorText}>{bleError}</Text>}
                </View>
            </View>
        </View>
    );
};

export default MainScreen;

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 880,
        width: '100%',
    },
    buttons: {
        marginTop: 180,
        paddingHorizontal: 90,
    },
    eclipse: {
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        width: '94%',
        height: 545,
        position: 'absolute',
        borderRadius: 20,
        left: '3%',
        right: '3%',
        top: '15%',
    },
    viewText: {
        marginTop: '80%',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 10,
    },
});
