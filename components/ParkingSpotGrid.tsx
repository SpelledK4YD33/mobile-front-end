import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ParkingSpot } from '@/types/parking';

interface ParkingSpotGridProps {
  spots: ParkingSpot[];
  onSpotPress?: (spot: ParkingSpot) => void;
}

export default function ParkingSpotGrid({ spots, onSpotPress }: ParkingSpotGridProps) {
  const renderParkingSpot = (spot: ParkingSpot) => (
    <TouchableOpacity
      key={spot.parkingSpotId}
      style={[
        styles.parkingSpot,
        spot.isReserved ? styles.occupiedSpot : styles.availableSpot
      ]}
      onPress={() => onSpotPress?.(spot)}
      disabled={spot.isReserved}
    >
      <Text style={[
        styles.spotText,
        spot.isReserved ? styles.occupiedText : styles.availableText
      ]}>
        {spot.parkingSpotName}
      </Text>
    </TouchableOpacity>
  );

  
  const groupedSpots = spots.reduce((acc, spot) => {
    const section = spot.parkingSpotName.charAt(0);
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(spot);
    return acc;
  }, {} as Record<string, ParkingSpot[]>);

  return (
    <View style={styles.container}>
      {Object.entries(groupedSpots).map(([section, sectionSpots]) => (
        <View key={section} style={styles.section}>
          <Text style={styles.sectionLabel}>{section}</Text>
          <View style={styles.spotsGrid}>
            {sectionSpots.map(renderParkingSpot)}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  spotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  parkingSpot: {
    width: 60,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    margin: 4,
  },
  availableSpot: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  occupiedSpot: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  spotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#2E7D32',
  },
  occupiedText: {
    color: '#c62828',
  },
});