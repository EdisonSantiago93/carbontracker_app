import { styles } from '@/screens/Onboarding/OnboardingScreen.styles.ts';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { db } from '../../../firebaseConfig.js';
const PagerViewAny: any = PagerView;
const MI: any = MaterialIcons;

// width/height not required here; styles use fixed sizes

export default function OnboardingScreen({ navigation }: { navigation: any }): JSX.Element {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansQuery = query(collection(db, 'plans'), orderBy('orden'));
        const querySnapshot = await getDocs(plansQuery);
        const plansData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);
      } catch (error) {
        console.error('Error al obtener los planes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const renderCharacteristic = (item: any, index: number): JSX.Element => {
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
          source={require('../../../assets/splash/iconosplash.png')}
          style={styles.headerLogo}
        />
        <Text style={styles.headerTitle}>Nuestros Planes</Text>
        <Text style={styles.headerSubtitle}>Conoce las opciones disponibles para ti</Text>
      </View>

      {/* Pager */}
      <PagerViewAny
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e: any) => setPage(e.nativeEvent.position)}
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
                    <MI name="check" size={16} color="#FFD700" />
                    <Text style={styles.badgeText}>Más Popular</Text>
                  </View>
                )}

                <Text style={styles.planName}>{plan.nombrePlan}</Text>
                <Text style={styles.planDescription}>{plan.descripcion}</Text>

                {/* Precio */}
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Desde</Text>
                  <Text style={styles.price}>
                    {plan.precio === -1 ? 'A medida' : `$${plan.precio}`}
                  </Text>
                  {plan.precio !== -1 && <Text style={styles.pricePeriod}>/mes</Text>}
                </View>

                {/* Características */}
                <View style={styles.characteristicsContainer}>
                  <Text style={styles.characteristicsTitle}>¿Qué incluye?</Text>
                  {plan.caracteristicas.map((item: any, index: number) =>
                    renderCharacteristic(item, index),
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        ))}
      </PagerViewAny>

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
                  backgroundColor: i === page ? '#65C879' : '#E0E0E0',
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
            onPress={() => navigation.replace('Login')}
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
              onPress={() => navigation.replace('Login')}
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
