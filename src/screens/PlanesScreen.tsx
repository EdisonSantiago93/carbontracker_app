import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Text, Button, Chip } from "react-native-paper";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { getSession } from "../utils/session";

export default function PlanesScreen({ navigation }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const user = await getSession("user");
        if (user && user.planAsignado) {
          setCurrentPlan(user.planAsignado);
          
          // Calcular días restantes
          const fechaAsignacion = new Date(user.planAsignado.fechaAsignacion);
          const vigencia = user.planAsignado.vigenciaDias || 0;
          const fechaExpiracion = new Date(fechaAsignacion);
          fechaExpiracion.setDate(fechaExpiracion.getDate() + vigencia);
          
          const hoy = new Date();
          const diasRestantes = Math.ceil((fechaExpiracion - hoy) / (1000 * 60 * 60 * 24));
          setDaysRemaining(diasRestantes > 0 ? diasRestantes : 0);
        }

        // Obtener planes disponibles
        const plansQuery = query(collection(db, "plans"), orderBy("orden"));
        const querySnapshot = await getDocs(plansQuery);
        const plansData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCharacteristic = (item, index) => {
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

  const handleContactWhatsApp = () => {
    const phoneNumber = "593999999999"; // Reemplaza con tu número
    const message = "Hola, me gustaría obtener más información sobre los planes de CarbonTracker";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const isCurrentPlan = (planId) => {
    return currentPlan && currentPlan.planId === planId;
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="workspace-premium" size={48} color="#FFD700" />
        <Text style={styles.headerTitle}>Planes Disponibles</Text>
        <Text style={styles.headerSubtitle}>
          Conoce todas las opciones que tenemos para ti
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan actual del usuario */}
        {currentPlan && (
          <View style={styles.currentPlanBanner}>
            <View style={styles.currentPlanHeader}>
              <MaterialIcons name="check-circle" size={24} color="#65C879" />
              <Text style={styles.currentPlanTitle}>Tu Plan Actual</Text>
            </View>
            <Text style={styles.currentPlanName}>{currentPlan.nombrePlan}</Text>
            <View style={styles.currentPlanInfo}>
              <View style={styles.infoItem}>
                <MaterialIcons name="calendar-today" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {daysRemaining > 0 ? `${daysRemaining} días restantes` : "Plan expirado"}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="storage" size={16} color="#666" />
                <Text style={styles.infoText}>
                  Datos: {currentPlan.persistenciaDatos === "permanente" ? "Permanentes" : "Sesión"}
                </Text>
              </View>
            </View>
            {daysRemaining <= 30 && daysRemaining > 0 && (
              <View style={styles.warningBanner}>
                <MaterialIcons name="warning" size={18} color="#F5A623" />
                <Text style={styles.warningText}>
                  Tu plan vence pronto. Renueva para seguir disfrutando de todos los beneficios.
                </Text>
              </View>
            )}
            {daysRemaining <= 0 && (
              <View style={[styles.warningBanner, { backgroundColor: "#FFEBEE" }]}>
                <MaterialIcons name="error" size={18} color="#E74C3C" />
                <Text style={[styles.warningText, { color: "#E74C3C" }]}>
                  Tu plan ha expirado. Renueva para recuperar el acceso completo.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Título de otros planes */}
        <Text style={styles.sectionTitle}>Explora Otros Planes</Text>

        {/* Lista de planes */}
        {plans.map((plan, index) => {
          const isPlanActual = isCurrentPlan(plan.id);
          
          return (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                isPlanActual && styles.planCardCurrent,
              ]}
            >
              {/* Badge */}
              <View style={styles.badgeContainer}>
                {isPlanActual && (
                  <Chip
                    icon="check"
                    style={styles.currentChip}
                    textStyle={styles.currentChipText}
                  >
                    Plan Actual
                  </Chip>
                )}
                {plan.recomendado && !isPlanActual && (
                  <View style={styles.badge}>
                    <MaterialIcons name="star" size={16} color="#FFD700" />
                    <Text style={styles.badgeText}>Más Popular</Text>
                  </View>
                )}
              </View>

              {/* Header del plan */}
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.nombrePlan}</Text>
                <Text style={styles.planDescription}>{plan.descripcion}</Text>
              </View>

              {/* Precio */}
              <View style={styles.priceContainer}>
                {plan.precio === -1 ? (
                  <>
                    <Text style={styles.priceCustom}>Precio a medida</Text>
                    <Text style={styles.priceSubtext}>Contáctanos para cotizar</Text>
                  </>
                ) : (
                  <>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceCurrency}>$</Text>
                      <Text style={styles.price}>{plan.precio}</Text>
                      <Text style={styles.pricePeriod}>/mes</Text>
                    </View>
                  </>
                )}
              </View>

              {/* Características */}
              <View style={styles.characteristicsContainer}>
                <Text style={styles.characteristicsTitle}>
                  Características incluidas
                </Text>
                {plan.caracteristicas.map((item, idx) =>
                  renderCharacteristic(item, idx)
                )}
              </View>

              {/* Botón de acción */}
              {isPlanActual ? (
                <Button
                  mode="outlined"
                  disabled
                  style={styles.activeButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.activeButtonLabel}
                  icon="check"
                >
                  Plan Activo
                </Button>
              ) : plan.precio === -1 ? (
                <Button
                  mode="outlined"
                  onPress={handleContactWhatsApp}
                  style={styles.contactButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.contactButtonLabel}
                  icon="whatsapp"
                >
                  Contactar por WhatsApp
                </Button>
              ) : (
                <Button
                  mode={plan.recomendado ? "contained" : "outlined"}
                  onPress={handleContactWhatsApp}
                  style={
                    plan.recomendado ? styles.selectButton : styles.infoButton
                  }
                  contentStyle={styles.buttonContent}
                  labelStyle={
                    plan.recomendado
                      ? styles.selectButtonLabel
                      : styles.infoButtonLabel
                  }
                >
                  Cambiar a este Plan
                </Button>
              )}
            </View>
          );
        })}

        {/* Footer info */}
        <View style={styles.footerInfo}>
          <MaterialIcons name="info-outline" size={20} color="#666" />
          <Text style={styles.footerText}>
            ¿Tienes dudas? Contáctanos para ayudarte a elegir el mejor plan
          </Text>
        </View>

        <Button
          mode="text"
          onPress={handleContactWhatsApp}
          style={styles.footerButton}
          labelStyle={styles.footerButtonLabel}
          icon="phone"
        >
          Contactar Soporte
        </Button>
      </ScrollView>
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
    paddingTop: 40,
    paddingBottom: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  currentPlanBanner: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#65C879",
  },
  currentPlanHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  currentPlanTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#65C879",
    marginLeft: 8,
  },
  currentPlanName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  currentPlanInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#F5A623",
    marginLeft: 8,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  planCardCurrent: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    opacity: 0.7,
  },
  badgeContainer: {
    marginBottom: 16,
  },
  currentChip: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
  },
  currentChipText: {
    color: "#65C879",
    fontWeight: "600",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F5A623",
    marginLeft: 4,
  },
  planHeader: {
    marginBottom: 20,
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
  },
  priceContainer: {
    backgroundColor: "#F8F9FA",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceCurrency: {
    fontSize: 24,
    fontWeight: "600",
    color: "#65C879",
    marginRight: 4,
  },
  price: {
    fontSize: 40,
    fontWeight: "700",
    color: "#65C879",
  },
  pricePeriod: {
    fontSize: 18,
    color: "#999",
    marginLeft: 4,
  },
  priceCustom: {
    fontSize: 28,
    fontWeight: "700",
    color: "#65C879",
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 14,
    color: "#999",
  },
  characteristicsContainer: {
    marginBottom: 24,
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
  buttonContent: {
    paddingVertical: 8,
  },
  activeButton: {
    borderRadius: 8,
    borderColor: "#E0E0E0",
    borderWidth: 1.5,
    backgroundColor: "#F5F5F5",
  },
  activeButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  selectButton: {
    backgroundColor: "#65C879",
    borderRadius: 8,
    elevation: 2,
  },
  selectButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoButton: {
    borderRadius: 8,
    borderColor: "#65C879",
    borderWidth: 1.5,
  },
  infoButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#65C879",
  },
  contactButton: {
    borderRadius: 8,
    borderColor: "#25D366",
    borderWidth: 1.5,
  },
  contactButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#25D366",
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  footerText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    lineHeight: 20,
  },
  footerButton: {
    marginTop: 8,
  },
  footerButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#65C879",
  },
});