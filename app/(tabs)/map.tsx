import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, RefreshCw, Wifi, WifiOff } from 'lucide-react-native';
import { parkingService } from '@/services/parkingService';
import { ParkingSpot } from '@/types/parking';
import ParkingSpotGrid from '@/components/ParkingSpotGrid';

export default function MapScreen() {
  const [selectedBasement, setSelectedBasement] = useState<1 | 2>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchParkingData = async (showLoading = true) => {
    if (showLoading) {
      setIsRefreshing(true);
    }
    setError(null);
    try {
      const [spots, stats] = await Promise.all([
        parkingService.getAllParkingSpots(),
        parkingService.getParkingStats()
      ]);

      setParkingSpots(spots);
      setAvailableCount(stats.available);
      setLastUpdated(new Date());
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to fetch parking data:', err);
      setError('Failed to connect to parking system');
      setIsConnected(false);
    } finally {
      if (showLoading) {
        setIsRefreshing(false);
      }
    }
  };

  const refreshSpaces = () => {
    fetchParkingData(true);
  };

  // Initial data fetch
  useEffect(() => {
    fetchParkingData(true);
  }, []);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchParkingData(false);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSpotPress = (spot: ParkingSpot) => {
    if (!spot.isReserved) {
      Alert.alert(
        'Parking Spot Selected',
        `You selected spot ${spot.parkingSpotName}. Would you like to navigate to this spot?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Navigate', onPress: () => console.log(`Navigating to ${spot.parkingSpotName}`) }
        ]
      );
    }
  };

  // Filter spots by basement
  const getBasementSpots = (basement: number) => {
    return parkingSpots.filter(spot => spot.parkingSpotName.includes(`Zone B${basement}`));
  };

  const currentSpots = getBasementSpots(selectedBasement);
  const currentAvailable = currentSpots.filter(spot => !spot.isReserved).length;
  const totalSpots = currentSpots.length;

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Live Parking Map</Text>
          <View style={styles.connectionStatus}>
            {isConnected ? (
              <Wifi size={14} color="#4CAF50" />
            ) : (
              <WifiOff size={14} color="#f44336" />
            )}
            <Text style={[styles.connectionText, { color: isConnected ? '#4CAF50' : '#f44336' }]}>
              {isConnected ? 'Live' : 'Offline'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshSpaces}
          disabled={isRefreshing}
        >
          <RefreshCw
            size={24}
            color="#fff"
            style={[isRefreshing && styles.spinning]}
          />
        </TouchableOpacity>
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refreshSpaces} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Basement Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedBasement === 1 ? styles.activeToggle : styles.inactiveToggle
          ]}
          onPress={() => setSelectedBasement(1)}
        >
          <Text style={[
            styles.toggleText,
            selectedBasement === 1 ? styles.activeToggleText : styles.inactiveToggleText
          ]}>
            Basement 1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedBasement === 2 ? styles.activeToggle : styles.inactiveToggle
          ]}
          onPress={() => setSelectedBasement(2)}
        >
          <Text style={[
            styles.toggleText,
            selectedBasement === 2 ? styles.activeToggleText : styles.inactiveToggleText
          ]}>
            Basement 2
          </Text>
        </TouchableOpacity>
      </View>

      {/* Parking Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            Available: {currentAvailable}/{totalSpots}
          </Text>
          {lastUpdated && (
            <Text style={styles.lastUpdatedText}>
              Updated {formatLastUpdated(lastUpdated)}
            </Text>
          )}
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${totalSpots > 0 ? (currentAvailable / totalSpots) * 100 : 0}%` }
            ]}
          />
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.availableSpot]} />
          <Text style={styles.legendText}>Available ({currentAvailable})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.occupiedSpot]} />
          <Text style={styles.legendText}>Occupied ({totalSpots - currentAvailable})</Text>
        </View>
      </View>

      {/* Parking Layout */}
      <View style={styles.mapContainer}>
        {currentSpots.length > 0 ? (
          <>
            {/* Entry Point */}
            <View style={styles.entryPoint}>
              <View style={styles.entryCircle} />
              <Text style={styles.entryText}>Entry</Text>
            </View>
            {/* Parking Spots Grid */}
            <ParkingSpotGrid
              spots={currentSpots}
              onSpotPress={handleSpotPress}
            />
            {/* Exit Point */}
            <View style={styles.exitPoint}>
              <Text style={styles.exitText}>Exit</Text>
              <View style={styles.exitArrow} />
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              {isConnected ? 'No parking data available' : 'Unable to load parking data'}
            </Text>
            <TouchableOpacity style={styles.reloadButton} onPress={refreshSpaces}>
              <Text style={styles.reloadButtonText}>Reload</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Database Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Database Connection</Text>
        <Text style={styles.infoText}>
          Connected to Spring Boot backend with SQL database
        </Text>
        <Text style={styles.infoSubtext}>
          Real-time updates every 15 seconds
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#009999',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 8,
  },
  spinning: {
    // Add rotation animation here if needed
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
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
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#009999',
  },
  inactiveToggle: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeToggleText: {
    color: '#fff',
  },
  inactiveToggleText: {
    color: '#666',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#009999',
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  availableSpot: {
    backgroundColor: '#4CAF50',
  },
  occupiedSpot: {
    backgroundColor: '#f44336',
  },
  mapContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 300,
  },
  entryPoint: {
    alignItems: 'center',
    marginBottom: 20,
  },
  entryCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#009999',
    marginBottom: 4,
  },
  entryText: {
    fontSize: 12,
    color: '#009999',
    fontWeight: '600',
  },
  exitPoint: {
    alignItems: 'center',
    marginTop: 20,
  },
  exitText: {
    fontSize: 12,
    color: '#f44336',
    fontWeight: '600',
    marginBottom: 4,
  },
  exitArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#f44336',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  reloadButton: {
    backgroundColor: '#009999',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoSubtext: {
    fontSize: 11,
    color: '#999',
  },
});
