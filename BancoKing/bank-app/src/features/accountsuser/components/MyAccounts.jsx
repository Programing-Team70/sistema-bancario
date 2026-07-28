import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserAccountStore } from '../store/useUserAccountStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError } from '../../../shared/utils/toast.js';

const PAGE_SIZE = 7;

export const MyAccounts = () => {
  const navigation = useNavigation();

  const {
    myAccounts = [],
    loadingAccounts,
    errorAccounts,
    getMyAccounts,
    clearUserStore,
  } = useUserAccountStore();

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMyAccounts();

    return () => {
      clearUserStore();
    };
  }, [getMyAccounts, clearUserStore]);

  useEffect(() => {
    if (errorAccounts) {
      showError(errorAccounts);
    }
  }, [errorAccounts]);

  const filteredAccounts = useMemo(() => {
    return myAccounts.filter((a) => {
      if (!a) return false;
      const accountType = (a.type || '').toUpperCase();
      const status = a.status;
      const matchesType = typeFilter === 'ALL' ? true : accountType === typeFilter.toUpperCase();
      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'ACTIVE'
            ? status === true
            : status === false;

      return matchesType && matchesStatus;
    });
  }, [myAccounts, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAccounts.slice(start, start + PAGE_SIZE);
  }, [filteredAccounts, currentPage]);

  if (loadingAccounts && myAccounts.length === 0) {
    return <Spinner />;
  }

  const handleViewMovements = (accountId) => {
    navigation.navigate('MovementsUser', { accountId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Cuentas</Text>
          <Text style={styles.subtitle}>Resumen y estado de tus cuentas</Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => getMyAccounts({ force: true })}
        >
          <MaterialIcons name="sync" size={20} color="#ffffff" />
          <Text style={styles.refreshButtonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterWrapper}>
            <Text style={styles.filterLabel}>Tipo:</Text>
            <View style={styles.picker}>
              <Text
                style={styles.pickerText}
                onPress={() => {
                  setTypeFilter(typeFilter === 'ALL' ? 'MONETARIA' : typeFilter === 'MONETARIA' ? 'AHORRO' : 'ALL');
                  setPage(1);
                }}
              >
                {typeFilter === 'ALL' ? 'Todos los tipos' : typeFilter === 'MONETARIA' ? 'Monetaria' : 'Ahorro'}
              </Text>
            </View>
          </View>

          <View style={styles.filterWrapper}>
            <Text style={styles.filterLabel}>Estado:</Text>
            <View style={styles.picker}>
              <Text
                style={styles.pickerText}
                onPress={() => {
                  setStatusFilter(statusFilter === 'ALL' ? 'ACTIVE' : statusFilter === 'ACTIVE' ? 'INACTIVE' : 'ALL');
                  setPage(1);
                }}
              >
                {statusFilter === 'ALL' ? 'Todos los estados' : statusFilter === 'ACTIVE' ? 'Activas' : 'Inactivas'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.tableCard}>
          {paginatedAccounts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No posees cuentas bancarias registradas o que coincidan con los filtros.
              </Text>
            </View>
          ) : (
            paginatedAccounts.map((a) => {
              const accountId = a.id || a._id;

              return (
                <View key={accountId} style={styles.accountCard}>
                  <View style={styles.accountRow}>
                    <Text style={styles.accountLabel}>No. Cuenta:</Text>
                    <Text style={styles.accountValue}>{a.accountNumber || '-'}</Text>
                  </View>

                  <View style={styles.accountRow}>
                    <Text style={styles.accountLabel}>Usuario:</Text>
                    <Text style={styles.accountValue}>{a.userId || '-'}</Text>
                  </View>

                  <View style={styles.accountRow}>
                    <Text style={styles.accountLabel}>Tipo:</Text>
                    <View style={[
                      styles.badge,
                      a.type === 'MONETARIA' ? styles.badgeAdmin : styles.badgeUser
                    ]}>
                      <Text style={styles.badgeText}>{a.type || '-'}</Text>
                    </View>
                  </View>

                  <View style={styles.accountRow}>
                    <Text style={styles.accountLabel}>Saldo:</Text>
                    <Text style={styles.accountValue}>
                      Q {Number(a.balance || 0).toLocaleString('es-GT', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>

                  <View style={styles.accountRow}>
                    <Text style={styles.accountLabel}>Moneda:</Text>
                    <Text style={styles.accountValue}>{a.currency || '-'}</Text>
                  </View>

                  <View style={styles.accountRow}>
                    <Text style={styles.accountLabel}>Estado:</Text>
                    <View style={[
                      styles.badge,
                      a.status ? styles.badgeAdmin : styles.badgeUser
                    ]}>
                      <Text style={styles.badgeText}>{a.status ? 'ACTIVA' : 'INACTIVA'}</Text>
                    </View>
                  </View>

                  <View style={styles.accountRow}>
                    <Text style={styles.accountLabel}>Fecha creación:</Text>
                    <Text style={styles.accountValue}>
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewMovements(accountId)}
                  >
                    <MaterialIcons name="visibility" size={20} color="#2563eb" />
                    <Text style={styles.actionButtonText}>Ver movimientos</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.pagination}>
          <Text style={styles.paginationText}>
            Mostrando {(currentPage - 1) * PAGE_SIZE + (paginatedAccounts.length ? 1 : 0)} -{' '}
            {(currentPage - 1) * PAGE_SIZE + paginatedAccounts.length} de {filteredAccounts.length}
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
              {currentPage} / {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#065f46',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    position: 'relative',
    right: 40,
  },
  refreshButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '600',
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterWrapper: {
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
  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  accountValue: {
    fontSize: 14,
    fontWeight: '600',
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  actionButtonText: {
    color: '#2563eb',
    marginLeft: 8,
    fontWeight: '600',
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
