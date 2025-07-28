 import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Car, RefreshCw, Wifi, WifiOff } from 'lucide-react-native';
import { parkingService } from '@/services/parkingService';

export default function HomeScreen() {
  const [parkingStats, setParkingStats] = useState({ available: 0, total: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParkingData = async (showLoading = true) => {
    if (showLoading) setIsRefreshing(true);
    setError(null);
    try {
      const stats = await parkingService.getParkingStats();
      setParkingStats(stats);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to fetch parking data:', err);
      setError('Failed to connect to parking system');
      setIsConnected(false);
    } finally {
      if (showLoading) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchParkingData(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchParkingData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (!isConnected) return '#f44336';
    if (parkingStats.available === 0) return '#ff9800';
    return '#009999';
  };

  const basementAvailability = (ratio: number) => {
    return Math.max(0, Math.floor(parkingStats.available * ratio));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <Car size={40} color="#009999" strokeWidth={3} />
            </View>
          </View>
          <View>
            <Text style={styles.appTitle}>First Parking</Text>
            <View style={styles.connectionStatus}>
              {isConnected ? <Wifi size={16} color="#4CAF50" /> : <WifiOff size={16} color="#f44336" />}
              <Text style={[styles.connectionText, { color: isConnected ? '#4CAF50' : '#f44336' }]}>
                {isConnected ? 'Connected' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={() => fetchParkingData(true)} disabled={isRefreshing}>
          {isRefreshing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <RefreshCw size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchParkingData(true)} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Parking Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Live Parking Availability</Text>
        <View style={styles.statusRow}>
          <Text style={[styles.availableCount, { color: getStatusColor() }]}>{parkingStats.available}</Text>
          <Text style={styles.totalCount}>/ {parkingStats.total}</Text>
        </View>
        <View style={styles.statusBar}>
          <View
            style={[
              styles.statusFill,
              {
                width: `${parkingStats.total > 0 ? (parkingStats.available / parkingStats.total) * 100 : 0}%`,
                backgroundColor: getStatusColor(),
              },
            ]}
          />
        </View>
      </View>

      {/* Basement Section */}
      <View style={styles.basementSection}>
        <Text style={styles.sectionTitle}>Basement Levels</Text>

        {[
          { level: 'Basement Level 1', ratio: 0.6 },
          { level: 'Basement Level 2', ratio: 0.4 },
        ].map((basement, idx) => (
          <TouchableOpacity key={idx} style={styles.basementCard}>
            <View style={styles.basementIcon}>
              <Car size={24} color="#fff" />
            </View>
            <View style={styles.basementInfo}>
              <Text style={styles.basementTitle}>{basement.level}</Text>
              <Text style={styles.basementSubtitle}>{basementAvailability(basement.ratio)} spaces available</Text>
            </View>
            <View style={styles.basementArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
   },
   contentContainer: {
     paddingBottom: 20,
   },

   // Header
   header: {
     backgroundColor: '#009999',
     paddingTop: 60,
     paddingHorizontal: 20,
     paddingBottom: 20,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
   },
   logoContainer: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   logo: {
     width: 60,
     height: 60,
     borderRadius: 30,
     backgroundColor: '#fff',
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 15,
   },
   logoIcon: {
     width: 50,
     height: 50,
     borderRadius: 25,
     backgroundColor: '#f0f9ff',
     justifyContent: 'center',
     alignItems: 'center',
   },
   appTitle: {
     fontSize: 20,
     fontWeight: 'bold',
     color: '#fff',
     marginBottom: 4,
   },
   connectionStatus: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   connectionText: {
     fontSize: 12,
     marginLeft: 4,
     fontWeight: '500',
     color: '#fff',
   },
   refreshButton: {
     padding: 8,
     backgroundColor: 'rgba(255,255,255,0.2)',
     borderRadius: 20,
   },

   // Error
   errorBanner: {
     backgroundColor: '#ffe5e5',
     margin: 20,
     padding: 12,
     borderRadius: 8,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     borderLeftWidth: 4,
     borderLeftColor: '#f44336',
   },
   errorText: {
     color: '#c62828',
     fontSize: 14,
     flex: 1,
   },
   retryButton: {
     backgroundColor: '#f44336',
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 6,
   },
   retryText: {
     color: '#fff',
     fontSize: 12,
     fontWeight: '600',
   },

   // Parking Status
   statusCard: {
     backgroundColor: '#f9f9f9',
     marginHorizontal: 20,
     marginTop: 20,
     padding: 20,
     borderRadius: 12,
   },
   statusTitle: {
     fontSize: 16,
     color: '#333',
     marginBottom: 12,
     fontWeight: '600',
   },
   statusRow: {
     flexDirection: 'row',
     alignItems: 'flex-end',
     marginBottom: 16,
   },
   availableCount: {
     fontSize: 32,
     fontWeight: 'bold',
   },
   totalCount: {
     fontSize: 20,
     color: '#999',
     marginLeft: 4,
   },
   statusBar: {
     height: 8,
     backgroundColor: '#e0e0e0',
     borderRadius: 4,
     overflow: 'hidden',
   },
   statusFill: {
     height: '100%',
     borderRadius: 4,
     backgroundColor: '#009999',
   },

   // Basement List
   basementSection: {
     paddingHorizontal: 20,
     marginTop: 20,
   },
   sectionTitle: {
     fontSize: 18,
     fontWeight: 'bold',
     color: '#333',
     marginBottom: 16,
   },
   basementCard: {
     backgroundColor: '#f9f9f9',
     padding: 16,
     borderRadius: 12,
     marginBottom: 12,
     flexDirection: 'row',
     alignItems: 'center',
   },
   basementIcon: {
     width: 48,
     height: 48,
     borderRadius: 12,
     backgroundColor: '#009999',
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 16,
   },
   basementInfo: {
     flex: 1,
   },
   basementTitle: {
     fontSize: 16,
     fontWeight: '600',
     color: '#333',
     marginBottom: 4,
   },
   basementSubtitle: {
     fontSize: 14,
     color: '#666',
   },
   basementArrow: {
     paddingLeft: 12,
   },
   arrowText: {
     fontSize: 18,
     color: '#009999',
     fontWeight: 'bold',
   },
 });
