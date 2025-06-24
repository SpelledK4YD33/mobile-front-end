import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ArrowLeft, ArrowRight, Navigation2, MapPin } from 'lucide-react-native';

export default function NavigationScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const arrowRotation = new Animated.Value(0);

  const navigationSteps = [
    { instruction: 'ENTER BASEMENT', direction: 'straight', distance: '50m' },
    { instruction: 'TURN RIGHT', direction: 'right', distance: '30m' },
    { instruction: 'GO STRAIGHT', direction: 'straight', distance: '40m' },
    { instruction: 'TURN LEFT TO Zone  B1', direction: 'left', distance: '20m' },
    { instruction: 'ARRIVE AT DESTINATION', direction: 'arrive', distance: '0m' }
  ];

  const startNavigation = () => {
    setIsNavigating(true);
    setCurrentStep(0);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < navigationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    if (isNavigating) {
      const interval = setInterval(() => {
        if (currentStep < navigationSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsNavigating(false);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isNavigating, currentStep]);

  const renderDirectionIcon = (direction: string) => {
    const iconSize = 80;
    const iconColor = '#009999';

    switch (direction) {
      case 'right':
        return <ArrowRight size={iconSize} color={iconColor} strokeWidth={3} />;
      case 'left':
        return <ArrowLeft size={iconSize} color={iconColor} strokeWidth={3} />;
      case 'arrive':
        return <MapPin size={iconSize} color={iconColor} strokeWidth={3} />;
      default:
        return <Navigation2 size={iconSize} color={iconColor} strokeWidth={3} />;
    }
  };

  const currentInstruction = navigationSteps[currentStep];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Navigation</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Destination Info */}
      <View style={styles.destinationCard}>
        <Text style={styles.destinationTitle}>Going to Zone B2:20/100</Text>
        <Text style={styles.destinationSubtitle}>Basement 2 • Estimated arrival: 2 min</Text>
      </View>

      {/* Navigation Display */}
      <View style={styles.navigationContainer}>
        {isNavigating ? (
          <View style={styles.activeNavigation}>
            {/* Direction Icon */}
            <View style={styles.directionContainer}>
              {renderDirectionIcon(currentInstruction.direction)}
            </View>

            {/* Instruction */}
            <Text style={styles.instructionText}>
              {currentInstruction.instruction}
            </Text>

            {/* Distance */}
            <Text style={styles.distanceText}>
              in {currentInstruction.distance}
            </Text>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              {navigationSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index <= currentStep ? styles.activeDot : styles.inactiveDot
                  ]}
                />
              ))}
            </View>

            {/* Stop Navigation Button */}
            <TouchableOpacity style={styles.stopButton} onPress={stopNavigation}>
              <Text style={styles.stopButtonText}>Stop Navigation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.startNavigation}>
            {/* Map Preview */}
            <View style={styles.mapPreview}>
              <View style={styles.mapGrid}>
                {/* Simple grid representation */}
                {Array.from({ length: 6 }, (_, i) => (
                  <View key={i} style={styles.mapRow}>
                    {Array.from({ length: 8 }, (_, j) => (
                      <View
                        key={j}
                        style={[
                          styles.mapCell,
                          (i === 2 && j === 6) ? styles.destinationCell : styles.normalCell
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>
              <View style={styles.routeLine} />
            </View>

            {/* Route Info */}
            <View style={styles.routeInfo}>
              <View style={styles.routeDetail}>
                <Text style={styles.routeLabel}>Distance</Text>
                <Text style={styles.routeValue}>140m</Text>
              </View>
              <View style={styles.routeDetail}>
                <Text style={styles.routeLabel}>Duration</Text>
                <Text style={styles.routeValue}>2 min</Text>
              </View>
              <View style={styles.routeDetail}>
                <Text style={styles.routeLabel}>Turns</Text>
                <Text style={styles.routeValue}>3</Text>
              </View>
            </View>

            {/* Start Navigation Button */}
            <TouchableOpacity style={styles.startButton} onPress={startNavigation}>
              <Navigation2 size={24} color="#fff" style={styles.startButtonIcon} />
              <Text style={styles.startButtonText}>Start Navigation</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  destinationCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  destinationSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  navigationContainer: {
    flex: 1,
    margin: 20,
  },
  activeNavigation: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  directionContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#009999',
  },
  inactiveDot: {
    backgroundColor: '#e0e0e0',
  },
  stopButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  startNavigation: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPreview: {
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
    padding: 20,
    position: 'relative',
  },
  mapGrid: {
    flex: 1,
  },
  mapRow: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 2,
  },
  mapCell: {
    flex: 1,
    marginRight: 2,
    borderRadius: 2,
  },
  normalCell: {
    backgroundColor: '#e0e0e0',
  },
  destinationCell: {
    backgroundColor: '#009999',
  },
  routeLine: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    borderWidth: 2,
    borderColor: '#009999',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  routeDetail: {
    alignItems: 'center',
  },
  routeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  routeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  startButton: {
    backgroundColor: '#009999',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonIcon: {
    marginRight: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    color: '#009999',
    fontSize: 14,
    fontWeight: '600',
  },
});