import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import PagerView from "react-native-pager-view";
import { Text, Button } from "react-native-paper";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen({ navigation }: { navigation: any }): JSX.Element {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansQuery = query(collection(db, "plans"), orderBy("orden"));
        const querySnapshot = await getDocs(plansQuery);
        const plansData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);
      } catch (error) {
        console.error("Error al obtener los planes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const renderCharacteristic = (item: any, index: number): JSX.Element => {
    let valorTexto = item.valor;
    let icono = "check-circle";
    let iconColor = "#65C879";

    if (item.tag === "persistencia-datos") {
      if (item.valor === "sesion") {
        valorTexto = "Se borran al cerrar";
      } else if (item.valor === "permanente") {
        valorTexto = "Se guardan";
      }
    }

    if (item.tag === "historial-datos") {
      if (item.valor === 0) {
        valorTexto = "";
        icono = "cancel";
        iconColor = "#E74C3C";
      } else if (item.valor > 0) {
        valorTexto = `${item.valor} meses`;
      }
    }

    if (item.tag === "recomendaciones" && item.valor === "ninguna") {
      valorTexto = "";
      icono = "cancel";
      iconColor = "#E74C3C";
    }

    if (item.tag === "reportes-corporativos" && item.valor === 0) {
      valorTexto = "";
      icono = "cancel";
      iconColor = "#E74C3C";
    }

    if (item.tag === "exportacion-datos" && item.valor === "no") {
      valorTexto = "";
      icono = "cancel";
      iconColor = "#E74C3C";
    }

    if (item.tag === "soporte" && item.valor === "ninguno") {
      valorTexto = "";
      icono = "cancel";
      iconColor = "#E74C3C";
    }

    if (item.tag === "limite-usuarios" && item.valor === -1) {
      valorTexto = "Sin límite";
    }

    return (
      <View key={index} style={styles.characteristicItem}>
        <View style={[styles.iconCircle, { backgroundColor: iconColor + "15" }]}>
          <MaterialIcons name={icono} size={18} color={iconColor} />
        </View>
        <Text style={styles.characteristicText}>
          <Text style={styles.characteristicName}>{item.nombre}</Text>
          {valorTexto ? `: ${valorTexto}` : ""}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#65C879" />
        <Text style={styles.loadingText}>Cargando planes...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/splash/iconosplash.png")}
          style={styles.headerLogo}
        />
        <Text style={styles.headerTitle}>Nuestros Planes</Text>
        <Text style={styles.headerSubtitle}>
          Conoce las opciones disponibles para ti
        </Text>
      </View>

      {/* Pager */}
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {plans.map((plan) => (
          <View key={plan.id} style={styles.page}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.card}>
                {/* Badge del plan */}
                {plan.recomendado && (
                  <View style={styles.badge}>
                    <MaterialIcons name="star" size={16} color="#FFD700" />
                    <Text style={styles.badgeText}>Más Popular</Text>
                  </View>
                )}

                <Text style={styles.planName}>{plan.nombrePlan}</Text>
                <Text style={styles.planDescription}>{plan.descripcion}</Text>

                {/* Precio */}
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Desde</Text>
                  <Text style={styles.price}>
                    {plan.precio === -1 ? "A medida" : `$${plan.precio}`}
                  </Text>
                  {plan.precio !== -1 && (
                    <Text style={styles.pricePeriod}>/mes</Text>
                  )}
                </View>

                {/* Características */}
                <View style={styles.characteristicsContainer}>
                  <Text style={styles.characteristicsTitle}>
                    ¿Qué incluye?
                  </Text>
                  {plan.caracteristicas.map((item: any, index: number) =>
                    renderCharacteristic(item, index)
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        ))}
      </PagerView>

      {/* Indicadores */}
      <View style={styles.dotsContainer}>
        <Text style={styles.dotsLabel}>
          {page + 1} de {plans.length}
        </Text>
        <View style={styles.dots}>
          {plans.map((_: any, i: number) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === page ? "#65C879" : "#E0E0E0",
                  width: i === page ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Footer con botones */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {page === plans.length - 1 ? (
          <Button
            mode="contained"
            onPress={() => navigation.replace("Login")}
            style={styles.buttonPrimary}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="arrow-right"
          >
            Continuar
          </Button>
        ) : (
          <View style={styles.buttonGroup}>
            <Button
              mode="text"
              onPress={() => navigation.replace("Login")}
              style={styles.buttonSkip}
              labelStyle={styles.buttonSkipLabel}
            >
              Saltar
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLogo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F5A623",
    marginLeft: 4,
  },
  planName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 14,
    color: "#999",
    marginRight: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: "700",
    color: "#65C879",
  },
  pricePeriod: {
    fontSize: 16,
    color: "#999",
    marginLeft: 4,
  },
  characteristicsContainer: {
    marginTop: 8,
  },
  characteristicsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  characteristicItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  characteristicText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  characteristicName: {
    fontWeight: "600",
    color: "#333",
  },
  dotsContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  dotsLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 8,
    fontWeight: "500",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  buttonGroup: {
    width: "100%",
    alignItems: "center",
  },
  buttonPrimary: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#65C879",
    elevation: 2,
  },
  buttonSkip: {
    width: "100%",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSkipLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
});