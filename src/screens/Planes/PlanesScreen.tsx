import { MaterialIcons } from '@expo/vector-icons';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, View } from 'react-native';
import { Button, Chip, Text } from 'react-native-paper';

import { styles } from '@/screens/Planes/PlanesScreen.styles.ts';
import { obtenerParametroPorTag } from '@/services/ParametrosService.tsx';
import type { Parametro } from '@/types/Parametro';
import { getSession } from '@/utils/session.ts';
import { db } from '../../../firebaseConfig.js';

const MI: any = MaterialIcons;

export default function PlanesScreen() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPlan, setCurrentPlan] = useState<any | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [contactoPlanes, setContactoPlanes] = useState<Parametro | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const user = await getSession('user');
        if (user && user.planAsignado) {
          setCurrentPlan(user.planAsignado);

          // Calcular días restantes
          const fechaAsignacion = new Date(user.planAsignado.fechaAsignacion);
          const vigencia = user.planAsignado.vigenciaDias || 0;
          const fechaExpiracion = new Date(fechaAsignacion);
          fechaExpiracion.setDate(fechaExpiracion.getDate() + vigencia);

          const hoy = new Date();
          // use getTime() to ensure numeric subtraction
          const diasRestantes = Math.ceil(
            (fechaExpiracion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
          );
          setDaysRemaining(diasRestantes > 0 ? diasRestantes : 0);
        }

        // Obtener planes disponibles
        const plansQuery = query(collection(db, 'plans'), orderBy('orden'));
        const querySnapshot = await getDocs(plansQuery);
        const plansData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);

        // ============================
        // Obtener parámetro CONTACTO_PLANES desde el Service
        // ============================
        const parametro = await obtenerParametroPorTag('CONTACTO_PLANES');
        if (parametro) {
          setContactoPlanes(parametro);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCharacteristic = (item: any, index: number) => {
    let valorTexto = item.valor;
    let icono = 'check-circle';
    let iconColor = '#65C879';

    if (item.tag === 'persistencia-datos') {
      if (item.valor === 'sesion') {
        valorTexto = 'Se borran al cerrar';
      } else if (item.valor === 'permanente') {
        valorTexto = 'Se guardan';
      }
    }

    if (item.tag === 'historial-datos') {
      if (item.valor === 0) {
        valorTexto = '';
        icono = 'cancel';
        iconColor = '#E74C3C';
      } else if (item.valor > 0) {
        valorTexto = `${item.valor} meses`;
      }
    }

    if (item.tag === 'recomendaciones' && item.valor === 'ninguna') {
      valorTexto = '';
      icono = 'cancel';
      iconColor = '#E74C3C';
    }

    if (item.tag === 'reportes-corporativos' && item.valor === 0) {
      valorTexto = '';
      icono = 'cancel';
      iconColor = '#E74C3C';
    }

    if (item.tag === 'exportacion-datos' && item.valor === 'no') {
      valorTexto = '';
      icono = 'cancel';
      iconColor = '#E74C3C';
    }

    if (item.tag === 'soporte' && item.valor === 'ninguno') {
      valorTexto = '';
      icono = 'cancel';
      iconColor = '#E74C3C';
    }

    if (item.tag === 'limite-usuarios' && item.valor === -1) {
      valorTexto = 'Sin límite';
    }

    return (
      <View key={index} style={styles.characteristicItem}>
        <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
          <MI name={icono} size={18} color={iconColor} />
        </View>
        <Text style={styles.characteristicText}>
          <Text style={styles.characteristicName}>{item.nombre}</Text>
          {valorTexto ? `: ${valorTexto}` : ''}
        </Text>
      </View>
    );
  };

  const handleContactWhatsApp = () => {
    const phoneNumber = contactoPlanes.valor; 
    const message = contactoPlanes.detalle; 
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const isCurrentPlan = (planId: any) => {
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
        <MI name="workspace-premium" size={48} color="#FFD700" />
        <Text style={styles.headerTitle}>Planes Disponibles</Text>
        <Text style={styles.headerSubtitle}>Conoce todas las opciones que tenemos para ti</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Plan actual del usuario */}
        {currentPlan && (
          <View style={styles.currentPlanBanner}>
            <View style={styles.currentPlanHeader}>
              <MI name="check-circle" size={24} color="#65C879" />
              <Text style={styles.currentPlanTitle}>Tu Plan Actual</Text>
            </View>
            <Text style={styles.currentPlanName}>{currentPlan.nombrePlan}</Text>
            <View style={styles.currentPlanInfo}>
              <View style={styles.infoItem}>
                <MI name="calendar-today" size={16} color="#666" />
                <Text style={styles.infoText}>
                  {daysRemaining > 0 ? `${daysRemaining} días restantes` : 'Plan expirado'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MI name="storage" size={16} color="#666" />
                <Text style={styles.infoText}>
                  Datos: {currentPlan.persistenciaDatos === 'permanente' ? 'Permanentes' : 'Sesión'}
                </Text>
              </View>
            </View>
            {daysRemaining <= 30 && daysRemaining > 0 && (
              <View style={styles.warningBanner}>
                <MI name="warning" size={18} color="#F5A623" />
                <Text style={styles.warningText}>
                  Tu plan vence pronto. Renueva para seguir disfrutando de todos los beneficios.
                </Text>
              </View>
            )}
            {daysRemaining <= 0 && (
              <View style={[styles.warningBanner, { backgroundColor: '#FFEBEE' }]}>
                <MI name="error" size={18} color="#E74C3C" />
                <Text style={[styles.warningText, { color: '#E74C3C' }]}>
                  Tu plan ha expirado. Renueva para recuperar el acceso completo.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Título de otros planes */}
        <Text style={styles.sectionTitle}>Explora Otros Planes</Text>

        {/* Lista de planes */}
        {plans.map((plan) => {
          const isPlanActual = isCurrentPlan(plan.id);

          return (
            <View key={plan.id} style={[styles.planCard, isPlanActual && styles.planCardCurrent]}>
              {/* Badge */}
              <View style={styles.badgeContainer}>
                {isPlanActual && (
                  <Chip icon="check" style={styles.currentChip} textStyle={styles.currentChipText}>
                    Plan Actual
                  </Chip>
                )}
                {plan.recomendado && !isPlanActual && (
                  <View style={styles.badge}>
                    <MI name="star" size={16} color="#FFD700" />
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
                <Text style={styles.characteristicsTitle}>Características incluidas</Text>
                {plan.caracteristicas.map((item: any, idx: number) =>
                  renderCharacteristic(item, idx),
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
                  mode={plan.recomendado ? 'contained' : 'outlined'}
                  onPress={handleContactWhatsApp}
                  style={plan.recomendado ? styles.selectButton : styles.infoButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={plan.recomendado ? styles.selectButtonLabel : styles.infoButtonLabel}
                >
                  Cambiar a este Plan
                </Button>
              )}
            </View>
          );
        })}

        {/* Footer info */}
        <View style={styles.footerInfo}>
          <MI name="info-outline" size={20} color="#666" />
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
