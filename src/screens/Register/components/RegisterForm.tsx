import { styles } from '@/screens/Register/components/RegisterForm.styles.ts';
import { obtenerParametroPorTag } from '@/services/ParametrosService.tsx';
import type { Parametro } from '@/types/Parametro';
import { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { Button, Checkbox, Text, TextInput } from 'react-native-paper';
interface RegisterFormProps {
  loading: boolean;
  onSubmit: (formData: any) => void;
}

export default function RegisterForm({ loading, onSubmit }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    correo: '',
    direccion: '',
    password: '',
    confirmPassword: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDataPolicy, setAcceptDataPolicy] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
  const [datos, setDatos] = useState<Parametro | null>(null);
  const [politicas, setPoliticas] = useState<Parametro | null>(null);
  const [terminos, setTerminos] = useState<Parametro | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urldatos = await obtenerParametroPorTag('URL_DATOS');
        if (urldatos) {
          setDatos(urldatos);
        }
        const urlpoliticas = await obtenerParametroPorTag('URL_POLITICAS');
        if (urlpoliticas) {
          setPoliticas(urlpoliticas);
        }
        const urlterminos = await obtenerParametroPorTag('URL_TERMINOS');
        if (urlterminos) {
          setTerminos(urlterminos);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);
  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        label="Nombres"
        value={formData.nombres}
        onChangeText={(text) => handleInputChange('nombres', text)}
        style={styles.input}
        mode="outlined"
        outlineColor="#E0E0E0"
        activeOutlineColor="#65C879"
        left={<TextInput.Icon icon="account" color="#65C879" />}
      />
      <TextInput
        label="Apellidos"
        value={formData.apellidos}
        onChangeText={(text) => handleInputChange('apellidos', text)}
        style={styles.input}
        mode="outlined"
        outlineColor="#E0E0E0"
        activeOutlineColor="#65C879"
        left={<TextInput.Icon icon="account-outline" color="#65C879" />}
      />
      <TextInput
        label="Cédula"
        value={formData.cedula}
        onChangeText={(text) => handleInputChange('cedula', text)}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        outlineColor="#E0E0E0"
        activeOutlineColor="#65C879"
        left={<TextInput.Icon icon="card-account-details" color="#65C879" />}
      />
      <TextInput
        label="Correo electrónico"
        value={formData.correo}
        onChangeText={(text) => handleInputChange('correo', text)}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
        outlineColor="#E0E0E0"
        activeOutlineColor="#65C879"
        left={<TextInput.Icon icon="email" color="#65C879" />}
      />
      <TextInput
        label="Dirección"
        value={formData.direccion}
        onChangeText={(text) => handleInputChange('direccion', text)}
        style={styles.input}
        mode="outlined"
        outlineColor="#E0E0E0"
        activeOutlineColor="#65C879"
        left={<TextInput.Icon icon="map-marker" color="#65C879" />}
      />
      <TextInput
        label="Contraseña"
        value={formData.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry={!visiblePassword}
        style={styles.input}
        mode="outlined"
        outlineColor="#E0E0E0"
        activeOutlineColor="#65C879"
        left={<TextInput.Icon icon="lock" color="#65C879" />}
        right={
          <TextInput.Icon
            icon={visiblePassword ? 'eye-off' : 'eye'}
            onPress={() => setVisiblePassword((v) => !v)}
            color="#999"
          />
        }
      />
      <TextInput
        label="Confirmar Contraseña"
        value={formData.confirmPassword}
        onChangeText={(text) => handleInputChange('confirmPassword', text)}
        secureTextEntry={!visibleConfirmPassword}
        style={styles.input}
        mode="outlined"
        outlineColor="#E0E0E0"
        activeOutlineColor="#65C879"
        left={<TextInput.Icon icon="lock-check" color="#65C879" />}
        right={
          <TextInput.Icon
            icon={visibleConfirmPassword ? 'eye-off' : 'eye'}
            onPress={() => setVisibleConfirmPassword((v) => !v)}
            color="#999"
          />
        }
      />

      <View style={styles.termsSection}>
        <View style={styles.checkboxRow}>
          <Checkbox.Android
            status={acceptTerms ? 'checked' : 'unchecked'}
            onPress={() => setAcceptTerms(!acceptTerms)}
            color="#65C879"
          />
          <Text style={styles.checkboxText}>
            Acepto los{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(terminos.valor)}
            >
              términos y condiciones
            </Text>{' '}
            y la{' '}
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL(politicas.valor)
              }
            >
              política de privacidad
            </Text>
          </Text>
        </View>

        <View style={styles.checkboxRow}>
          <Checkbox.Android
            status={acceptDataPolicy ? 'checked' : 'unchecked'}
            onPress={() => setAcceptDataPolicy(!acceptDataPolicy)}
            color="#65C879"
          />
          <Text style={styles.checkboxText}>
            Acepto el{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(datos.valor)}
            >
              tratamiento de datos
            </Text>
          </Text>
        </View>
      </View>

      <Button
        mode="contained"
        onPress={() => onSubmit(formData)}
        loading={loading}
        disabled={!acceptTerms || !acceptDataPolicy || loading}
        style={[styles.button, (!acceptTerms || !acceptDataPolicy) && styles.buttonDisabled]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Registrarse
      </Button>
    </View>
  );
}
