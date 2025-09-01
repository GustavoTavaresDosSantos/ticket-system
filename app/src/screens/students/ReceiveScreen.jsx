import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import CustomText from "../../components/CustomText";
import CustomButton from "../../components/CustomButton";

const { width, height } = Dimensions.get("window");

export default function ReceiveScreen({ navigation }) {
  const themeState = useSelector((state) => state.theme);
  const currentTheme = themeState.theme;
  const colors = themeState.colors[currentTheme];

  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [isInCorrectLocation, setIsInCorrectLocation] = useState(false);

  // Coordenadas da escola (exemplo - você deve ajustar para a localização real)
  const schoolLocation = {
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Dados das turmas e horários de recreio
  const classes = {
    "DS-V1": { name: "Desenvolvimento de Sistemas/V1", breakStart: "15:00", breakEnd: "15:15" },
    "DS-V2": { name: "Desenvolvimento de Sistemas/V2", breakStart: "15:30", breakEnd: "15:45" },
    "MA-V1": { name: "Mecânica Automotiva/V1", breakStart: "16:00", breakEnd: "16:15" }
  };

  const studentClass = "DS-V1";
  const classInfo = classes[studentClass];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    getLocationPermission();

    return () => clearInterval(timer);
  }, []);

  const getLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização negada");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      checkIfInCorrectLocation(currentLocation);
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert("Erro", "Não foi possível obter sua localização");
    }
  };

  const checkIfInCorrectLocation = (userLocation) => {
    if (!userLocation) return;

    const distance = getDistanceFromLatLonInKm(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      schoolLocation.latitude,
      schoolLocation.longitude
    );

    // Considera que está no local correto se estiver a menos de 100 metros
    setIsInCorrectLocation(distance < 0.1);
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distância em km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const getTimeUntilBreakEnd = () => {
    const [breakHour, breakMinute] = classInfo.breakEnd.split(':').map(Number);
    const breakEndTime = new Date(currentTime);
    breakEndTime.setHours(breakHour, breakMinute, 0, 0);

    // Adicionar 5 minutos extras
    breakEndTime.setMinutes(breakEndTime.getMinutes() + 5);

    const timeDiff = breakEndTime.getTime() - currentTime.getTime();
    
    if (timeDiff <= 0) {
      return null; // Tempo acabou
    }

    const minutes = Math.floor(timeDiff / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { minutes, seconds };
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleValidateTicket = () => {
    if (!isInCorrectLocation) {
      Alert.alert("Aviso", "Você precisa estar no local correto para validar o ticket.");
      return;
    }

    navigation.navigate("ValidateScreen");
  };

  const renderTimeRemaining = () => {
    const timeUntil = getTimeUntilBreakEnd();
    
    if (!timeUntil) {
      return (
        <CustomText style={[styles.timeText, { color: colors.danger }]}>
          Tempo esgotado!
        </CustomText>
      );
    }

    return (
      <CustomText style={[styles.timeText, { color: colors.text }]}>
        Tempo restante: {formatTime(timeUntil.minutes)}:{formatTime(timeUntil.seconds)}
      </CustomText>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.body }]}>
      <View style={styles.topSection}>
        {renderTimeRemaining()}
        
        <View style={[styles.locationCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <CustomText style={[styles.locationTitle, { color: colors.text }]}>
            Status da Localização
          </CustomText>
          <CustomText style={[
            styles.locationStatus, 
            { color: isInCorrectLocation ? colors.success : colors.danger }
          ]}>
            {isInCorrectLocation ? "✓ No local correto" : "✗ Fora do local"}
          </CustomText>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Validar Ticket"
            onPress={handleValidateTicket}
            disabled={!isInCorrectLocation}
          />
        </View>
      </View>

      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={schoolLocation}
              title="Escola"
              description="Local para resgatar o ticket"
              pinColor={colors.accent}
            />
          </MapView>
        ) : (
          <View style={[styles.loadingMap, { backgroundColor: colors.disabled }]}>
            <CustomText style={[styles.loadingText, { color: colors.text }]}>
              Carregando mapa...
            </CustomText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  locationCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  locationStatus: {
    fontSize: 18,
    fontWeight: "700",
  },
  buttonContainer: {
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  loadingMap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
});

