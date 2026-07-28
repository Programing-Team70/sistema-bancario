import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTransferStore } from '../store/useTransferStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError, showSuccess } from '../../../shared/utils/toast.js';

export const Transfers = () => {
  const { executeTransfer, loadingTransfer, errorTransfer, transferSuccess, resetTransferState } =
    useTransferStore();

  const [form, setForm] = useState({
    senderAccountNumber: '',
    receiverAccountNumber: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    if (errorTransfer) {
      showError(errorTransfer);
      resetTransferState();
    }
  }, [errorTransfer]);

  useEffect(() => {
    if (transferSuccess) {
      showSuccess('Transferencia realizada correctamente');

      setForm({
        senderAccountNumber: '',
        receiverAccountNumber: '',
        amount: '',
        description: '',
      });

      resetTransferState();
    }
  }, [transferSuccess]);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.senderAccountNumber.trim() || !form.receiverAccountNumber.trim() || !form.amount) {
      showError('Completa todos los campos obligatorios');
      return;
    }

    if (Number(form.amount) <= 0) {
      showError('El monto debe ser mayor a 0');
      return;
    }

    await executeTransfer({
      senderAccountNumber: form.senderAccountNumber.trim(),
      receiverAccountNumber: form.receiverAccountNumber.trim(),
      amount: Number(form.amount),
      description: form.description.trim(),
    });
  };

  const handleClear = () => {
    setForm({
      senderAccountNumber: '',
      receiverAccountNumber: '',
      amount: '',
      description: '',
    });
    resetTransferState();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Transferencias Bancarias</Text>
          <Text style={styles.subtitle}>Envía dinero entre cuentas registradas dentro del sistema bancario</Text>
        </View>
      </View>

      <View style={styles.layout}>
        <View style={styles.mainCard}>
          <View style={styles.transferHeader}>
            <View style={styles.headerIcon}>
              <MaterialIcons name="swap-horiz" size={30} color="#065f46" />
            </View>

            <View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>BANCO KING • TRANSFERENCIA</Text>
              </View>

              <Text style={styles.headerTitle}>Nueva Transferencia</Text>

              <Text style={styles.headerSubtitle}>
                Completa la información necesaria para realizar el movimiento bancario.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.grid}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Cuenta Emisora</Text>

                <View style={styles.inputWrapper}>
                  <MaterialIcons name="credit-card" size={18} color="#64748b" style={styles.inputIcon} />

                  <TextInput
                    style={styles.input}
                    placeholder="0000 0000 00 00"
                    placeholderTextColor="#94a3b8"
                    value={form.senderAccountNumber}
                    onChangeText={(value) => handleChange('senderAccountNumber', value)}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Cuenta Receptora</Text>

                <View style={styles.inputWrapper}>
                  <MaterialIcons name="credit-card" size={18} color="#64748b" style={styles.inputIcon} />

                  <TextInput
                    style={styles.input}
                    placeholder="0000 0000 00 00"
                    placeholderTextColor="#94a3b8"
                    value={form.receiverAccountNumber}
                    onChangeText={(value) => handleChange('receiverAccountNumber', value)}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Monto</Text>

              <View style={styles.inputWrapper}>
                <MaterialIcons name="account-balance-wallet" size={18} color="#64748b" style={styles.inputIcon} />

                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#94a3b8"
                  value={form.amount}
                  onChangeText={(value) => handleChange('amount', value)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Descripción</Text>

              <View style={[styles.inputWrapper, styles.textareaWrapper]}>
                <MaterialIcons name="description" size={18} color="#64748b" style={styles.inputIcon} />

                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Pago de servicios, transferencia personal, compra, etc..."
                  placeholderTextColor="#94a3b8"
                  value={form.description}
                  onChangeText={(value) => handleChange('description', value)}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.secondaryButton, loadingTransfer && styles.buttonDisabled]}
                onPress={handleClear}
                disabled={loadingTransfer}
              >
                <Text style={styles.secondaryButtonText}>Limpiar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.transferButton, loadingTransfer && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loadingTransfer}
              >
                {loadingTransfer ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <MaterialIcons name="send" size={18} color="#ffffff" />
                    <Text style={styles.transferButtonText}>Realizar Transferencia</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sideCard}>
          <View style={styles.sideTop}>
            <View style={styles.sideIcon}>
              <MaterialIcons name="check-circle" size={28} color="#16a34a" />
            </View>

            <Text style={styles.sideTitle}>Transferencias Seguras</Text>

            <Text style={styles.sideSubtitle}>
              Todas las transferencias son verificadas y procesadas de forma segura dentro del
              sistema bancario.
            </Text>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Monto mínimo</Text>
              <Text style={styles.infoValue}>Q 1.00</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Procesamiento</Text>
              <Text style={styles.infoValue}>Instantáneo</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Estado</Text>
              <Text style={[styles.infoValue, styles.successText]}>Disponible</Text>
            </View>
          </View>

          {transferSuccess && (
            <View style={styles.successBox}>
              <MaterialIcons name="check-circle" size={18} color="#16a34a" />
              <Text style={styles.successBoxText}>La transferencia fue realizada correctamente.</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  layout: {
    padding: 16,
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  transferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065f46',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  form: {
    marginTop: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldGroup: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1e293b',
  },
  textareaWrapper: {
    alignItems: 'flex-start',
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  transferButton: {
    flex: 2,
    backgroundColor: '#065f46',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  transferButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sideTop: {
    marginBottom: 20,
  },
  sideIcon: {
    marginBottom: 12,
  },
  sideTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  sideSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  infoList: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  successText: {
    color: '#16a34a',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#16a34a',
    borderRadius: 8,
    padding: 12,
  },
  successBoxText: {
    fontSize: 14,
    color: '#16a34a',
    marginLeft: 8,
    flex: 1,
  },
});
