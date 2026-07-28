import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useUserAccountStore } from '../store/useUserAccountStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError } from '../../../shared/utils/toast.js';

const PAGE_SIZE = 8;

export const MovementsUser = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { accountId } = route.params || {};

  const {
    selectedStatement,
    loadingStatement,
    errorStatement,
    getAccountStatement,
    clearSelectedStatement,
    filters,
    setFilters,
  } = useUserAccountStore();

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (accountId) {
      getAccountStatement(accountId, { force: true });
    }
    return () => {
      clearSelectedStatement();
    };
  }, [accountId, filters.currencyStatement]);

  useEffect(() => {
    if (errorStatement) showError(errorStatement);
  }, [errorStatement]);

  const movementsList = useMemo(() => {
    if (!selectedStatement) return [];
    if (Array.isArray(selectedStatement)) return selectedStatement;

    if (selectedStatement.statement && Array.isArray(selectedStatement.statement.movements)) {
      return selectedStatement.statement.movements;
    }

    return (
      selectedStatement.movements ||
      selectedStatement.transactions ||
      selectedStatement.history ||
      selectedStatement.data ||
      (Array.isArray(selectedStatement.account?.movements)
        ? selectedStatement.account.movements
        : []) ||
      []
    );
  }, [selectedStatement]);

  const accountHeaderInfo = useMemo(() => {
    return selectedStatement?.statement || null;
  }, [selectedStatement]);

  const totalPages = Math.max(1, Math.ceil(movementsList.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return movementsList.slice(start, start + PAGE_SIZE);
  }, [movementsList, currentPage]);

  if (loadingStatement && movementsList.length === 0) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={20} color="#065f46" />
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Tu Historial de Movimientos</Text>
          <Text style={styles.subtitle}>Detalle completo de transacciones asociadas a tu cuenta bancaria</Text>
        </View>
      </View>

      {accountHeaderInfo && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryDetails}>
            <Text style={styles.summaryLabel}>Número de Cuenta</Text>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summaryValue}>{accountHeaderInfo.accountNumber}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{accountHeaderInfo.accountType}</Text>
              </View>
            </View>
          </View>
          <View style={styles.summaryBalance}>
            <Text style={styles.summaryLabel}>Saldo Disponible</Text>
            <Text style={styles.balanceValue}>
              {accountHeaderInfo.currency || filters.currencyStatement || 'GTQ'}{' '}
              {Number(accountHeaderInfo.balance || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.filterContainer}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Moneda visualización:</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => {
              setFilters({ currencyStatement: filters.currencyStatement === 'GTQ' ? 'USD' : 'GTQ' });
              setPage(1);
            }}
          >
            <Text style={styles.pickerText}>
              {filters.currencyStatement === 'GTQ' ? 'Quetzales (GTQ)' : 'Dólares (USD)'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.refreshButton, loadingStatement && styles.refreshButtonDisabled]}
          onPress={() => getAccountStatement(accountId, { force: true })}
          disabled={loadingStatement}
        >
          <MaterialIcons name="refresh" size={16} color="#ffffff" />
          <Text style={styles.refreshButtonText}>
            {loadingStatement ? 'Actualizando...' : 'Actualizar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.tableCard}>
          {paginatedMovements.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No existen movimientos registrados para esta cuenta bancaria.
              </Text>
            </View>
          ) : (
            paginatedMovements.map((movement, index) => {
              const isNegative =
                movement.amount < 0 || movement.type === 'RETIRO' || movement.type === 'DEBITO';

              return (
                <View key={movement.id || movement._id || index} style={styles.movementCard}>
                  <View style={styles.movementRow}>
                    <Text style={styles.movementIndex}>
                      {(currentPage - 1) * PAGE_SIZE + (index + 1)}
                    </Text>
                    <Text style={styles.movementDate}>
                      {movement.date
                        ? new Date(movement.date).toLocaleDateString('es-GT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </Text>
                  </View>

                  <View style={styles.movementRow}>
                    <Text style={styles.movementLabel}>Tipo:</Text>
                    <View
                      style={[
                        styles.badge,
                        movement.type === 'DEPOSIT' ||
                          movement.type === 'DEPOSITO' ||
                          movement.type === 'TRANSFERENCIA_RECIBIDA'
                          ? styles.badgeAdmin
                          : styles.badgeUser,
                      ]}
                    >
                      <Text style={styles.badgeText}>{movement.type}</Text>
                    </View>
                  </View>

                  <View style={styles.movementRow}>
                    <Text style={styles.movementLabel}>Detalle:</Text>
                    <Text style={styles.movementDetail}>
                      {movement.accountNumber ||
                        movement.to ||
                        movement.description ||
                        'Operación en cuenta'}
                    </Text>
                  </View>

                  <View style={styles.movementRow}>
                    <Text style={styles.movementLabel}>Monto:</Text>
                    <Text
                      style={[
                        styles.movementAmount,
                        isNegative ? styles.amountNegative : styles.amountPositive,
                      ]}
                    >
                      {`${isNegative ? '-' : ''} ${filters.currencyStatement || 'GTQ'} ${Math.abs(
                        movement.amount
                      ).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.pagination}>
          <Text style={styles.paginationText}>
            Mostrando{' '}
            <Text style={styles.paginationBold}>
              {(currentPage - 1) * PAGE_SIZE + (paginatedMovements.length ? 1 : 0)}
            </Text>{' '}
            -{' '}
            <Text style={styles.paginationBold}>
              {(currentPage - 1) * PAGE_SIZE + paginatedMovements.length}
            </Text>{' '}
            de{' '}
            <Text style={styles.paginationBold}>{movementsList.length}</Text>
          </Text>

          <View style={styles.paginationButtons}>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.paginationButtonText}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </Text>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.paginationButtonDisabled,
              ]}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.paginationButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    color: '#065f46',
    marginLeft: 4,
    fontWeight: '600',
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
  summaryCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryDetails: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
  },
  summaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginRight: 8,
  },
  summaryBalance: {
    flex: 1,
    alignItems: 'flex-end',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeAdmin: {
    backgroundColor: '#dbeafe',
  },
  badgeUser: {
    backgroundColor: '#f1f5f9',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  pickerText: {
    fontSize: 14,
    color: '#1e293b',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#065f46',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  refreshButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  refreshButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  tableCard: {
    padding: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  movementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  movementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  movementIndex: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  movementDate: {
    fontSize: 12,
    color: '#64748b',
  },
  movementLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  movementDetail: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    flex: 1,
    textAlign: 'right',
  },
  movementAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  amountPositive: {
    color: '#16a34a',
  },
  amountNegative: {
    color: '#dc2626',
  },
  pagination: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  paginationText: {
    fontSize: 12,
    color: '#64748b',
  },
  paginationBold: {
    fontWeight: '700',
    color: '#1e293b',
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  paginationButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  paginationButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  pageInfo: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
});
