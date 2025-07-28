import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import axios from 'axios';
import {BASE_URL} from '@/services/parkingService'

export default function NavigationAndZoneScreen() {
  // Selected zone (either "Zone B1" or "Zone B2")
  const [zone, setZone] = useState<'Zone B1' | 'Zone B2'>('Zone B1');

  // Separate state for each direction's count
  const [frontCount, setFrontCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [leftCount, setLeftCount] = useState(0);

  // Emojis for each direction
  const displayNames = {
    front: '⬆️',
    right: '➡️',
    left: '⬅️',
  };

  // Fetch count for each direction individually
  const fetchCounts = async () => {
    try {
      const encodedZone = encodeURIComponent(zone);

      // Fetch front count
      const frontRes = await fetch(`${BASE_URL}/parkingSpot/count?direction=front&name=${encodeURIComponent(zone)}`)
      const frontData = await frontRes.json();
      setFrontCount(typeof frontData === 'number' ? frontData : 0);

      // Fetch right count
      const rightRes = await fetch(`${BASE_URL}/parkingSpot/count?direction=right&name=${encodeURIComponent(zone)}`);
      const rightData = await rightRes.json();
      setRightCount(typeof rightData === 'number' ? rightData : 0);

      // Fetch left count
      const leftRes = await fetch(`${BASE_URL}/parkingSpot/count?direction=left&name=${encodeURIComponent(zone)}`);
      const leftData = await leftRes.json();
      setLeftCount(typeof leftData === 'number' ? leftData : 0);
    } catch (error) {
      console.error('Error fetching parking spot counts:', error);
    }
  };

  // Refetch counts when the zone changes
  useEffect(() => {
    fetchCounts();
  }, [zone]);

  useEffect(() => {
    fetchCounts(); // Initial load
    const intervalId = setInterval(fetchCounts, 5000);
    return () => clearInterval(intervalId); // Cleanup
  }, [zone]);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        {/* 🧭 Centered Title */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Zone B1 & B2 Navigation</Text>
        </View>

        {/* 🔄 Reload Button with Icon */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchCounts}
        >
          <RefreshCw size={20} color="#009999" />
        </TouchableOpacity>
      </View>


      {/* 🔘 Zone Toggle */}
      <View style={styles.zoneToggleContainer}>
        {['Zone B1', 'Zone B2'].map((z) => (
          <TouchableOpacity
            key={z}
            onPress={() => setZone(z as 'Zone B1' | 'Zone B2')}
            style={[styles.zoneToggle, zone === z && styles.zoneToggleActive]}
          >
            <Text style={[styles.zoneToggleText, zone === z && styles.zoneToggleTextActive]}>
              {z}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📊 Directional Status */}
      <View style={styles.zoneStatus}>
        <Text style={styles.sectionTitle}>Live Directional Status for {zone}</Text>

        {/* Front */}
        <View style={styles.zoneRow}>
          <Text style={styles.zoneEmoji}>{displayNames.front}</Text>
          <Text style={styles.zoneLabel}>FRONT</Text>
          <Text style={styles.zoneCount}>{frontCount}</Text>
        </View>

        {/* Right */}
        <View style={styles.zoneRow}>
          <Text style={styles.zoneEmoji}>{displayNames.right}</Text>
          <Text style={styles.zoneLabel}>RIGHT</Text>
          <Text style={styles.zoneCount}>{rightCount}</Text>
        </View>

        {/* Left */}
        <View style={styles.zoneRow}>
          <Text style={styles.zoneEmoji}>{displayNames.left}</Text>
          <Text style={styles.zoneLabel}>LEFT</Text>
          <Text style={styles.zoneCount}>{leftCount}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#009999',
    padding: 10,
    borderRadius: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: { padding: 5 },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  placeholder: { width: 24 },

  zoneToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  zoneToggle: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#009999',
    marginHorizontal: 5,
  },
  zoneToggleActive: {
    backgroundColor: '#009999',
  },
  zoneToggleText: {
    fontSize: 14,
    color: '#009999',
  },
  zoneToggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },

  zoneStatus: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },

  refreshButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  refreshText: {
    color: '#009999',
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  zoneEmoji: { fontSize: 24, marginRight: 10 },
  zoneLabel: { flex: 1, fontSize: 16 },
  zoneCount: { fontSize: 16, fontWeight: 'bold', color: '#009999' },
});
