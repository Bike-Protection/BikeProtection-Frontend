import React, {useState} from 'react';
import {StyleSheet, View, Button, ImageBackground, Text} from 'react-native';
import {THEME} from '../src/Theme';
import BluetoothSerial from 'react-native-bluetooth-serial';


const MainScreen = ({navigation}) => {
    const localImage = require('../assets/fon3.png');
    const [changeColor, SetChangeColor] = useState(false);
    const [blocked, SetBlocked] = useState(false);

    const onPressHandler = () => {
        SetBlocked(!blocked);
        SetChangeColor(!changeColor);
        sendDataToArduino();

    }

    useEffect(() => {
        // Викликається при завантаженні компонента
        connectToArduino(); // Виклик функції підключення до Arduino
    }, []);


    const connectToArduino = async () => {
        try {
            await BluetoothSerial.isEnabled(); // Перевірка, чи ввімкнений Bluetooth на пристрої

            await BluetoothSerial.connect('C8:F0:9E:F3:AA:B0');

            console.log('Connected to Arduino!');
        } catch (error) {
            console.error('Error connecting to Arduino:', error);
        }
    };

    const sendDataToArduino = async () => {
        try {
            const data = blocked ? 'BLOCK' : 'UNBLOCK';
            await BluetoothSerial.write(data);
            console.log('Data sent to Arduino:', data);
        } catch (error) {
            console.error('Error sending data to Arduino:', error);
        }
    };


    return (
        <View style={{flex: 1}}>
            <View>
                <ImageBackground source={localImage} style={styles.image}/>
                <View style={styles.eclipse}/>

                <View style={styles.viewText}>
                    {blocked ?
                        <Text style={styles.text}>
                            Пристрій заблоковано
                        </Text>
                        :
                        <Text style={styles.text}>
                            Пристрій розблоковано
                        </Text>
                    }

                </View>
                <View style={styles.buttons}>
                    <Button
                        title={blocked ? 'Розблокувати' : 'Заблокувати'}
                        onPress={onPressHandler}
                        color={blocked ? THEME.GREEN_COLOR : THEME.RED_COLOR}
                    />
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
        width: '100%'
    },
    buttons: {
        marginTop: 180,
        paddingHorizontal: 90
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
        fontSize: 20
    }
});