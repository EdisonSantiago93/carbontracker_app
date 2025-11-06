import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { styles } from './LoginForm.styles';

export default function LoginForm({ loading, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(false);

  const handleSubmit = () => {
    onSubmit({ email, password });
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
        outlineColor="#E0E0E0"
        activeOutlineColor="#65C879"
        left={<TextInput.Icon icon="email" color="#65C879" />}
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
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

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Iniciar Sesión
      </Button>
    </View>
  );
}