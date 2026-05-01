import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';
import theme from '../constants/theme';

const f = theme.fonts;
const CARD_W = Dimensions.get('window').width - 48;

const HeaderCard = ({ name = 'Justin', splitLabel = 'Push', muscleGroups = '', onStart }) => {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(-16);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    ty.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, []);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: ty.value }] }));

  return (
    <Animated.View style={[styles.card, anim]}>
      {/* Image positioned to the RIGHT side */}
      <Image
        source={require('../assets/images/hero_workout.png')}
        style={styles.heroImg}
        resizeMode="cover"
      />

      {/* Gradient: dark on left, transparent on right to show image */}
      <LinearGradient
        colors={['rgba(10,14,23,1)', 'rgba(10,14,23,0.95)', 'rgba(10,14,23,0.6)', 'rgba(10,14,23,0.1)']}
        locations={[0, 0.25, 0.55, 0.8]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Bottom gradient for buttons */}
      <LinearGradient
        colors={['transparent', 'rgba(10,14,23,0.8)', 'rgba(10,14,23,0.95)']}
        locations={[0.3, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Green glow line */}
      <View style={styles.glowLine} />

      {/* Content — all left-aligned */}
      <View style={styles.content}>
        <View style={styles.textArea}>
          <Text style={styles.greet}>
            Hey <Text style={styles.nameCursive}>{name}</Text>,
          </Text>
          <Text style={styles.sub}>ready to</Text>
          <Text style={styles.accent}>
            <Text style={styles.cursiveAccent}>crush </Text>{splitLabel}
          </Text>
          <Text style={styles.sub}>today?</Text>
        </View>

        <Text style={styles.motto}>
          Discipline today.{'\n'}
          <Text style={styles.mottoG}>Strength</Text> tomorrow.
        </Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.go} onPress={onStart} activeOpacity={0.8}>
            <Ionicons name="barbell" size={15} color="#0a0e17" />
            <Text style={styles.goT}>Let's Go</Text>
          </TouchableOpacity>
          <View style={styles.badge}>
            <View style={styles.badgeIco}>
              <Ionicons name="fitness" size={16} color={theme.colors.accent} />
            </View>
            <View>
              <Text style={styles.badgeN}>{splitLabel.toUpperCase()}</Text>
              <Text style={styles.badgeS}>{muscleGroups}</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 280,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.15)',
  },
  heroImg: {
    position: 'absolute',
    top: -20,
    right: -30,
    width: CARD_W * 0.75,
    height: 320,
  },
  glowLine: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: theme.colors.accent,
    borderRadius: 1,
    opacity: 0.4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
    justifyContent: 'space-between',
    width: '65%',
  },
  textArea: {},
  greet: {
    fontFamily: f.black,
    color: theme.colors.textPrimary,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  nameCursive: {
    fontFamily: f.cursive,
    color: theme.colors.textPrimary,
    fontSize: 28,
  },
  sub: {
    fontFamily: f.extrabold,
    color: theme.colors.textPrimary,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  accent: {
    fontFamily: f.black,
    color: theme.colors.accent,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  cursiveAccent: {
    fontFamily: f.cursive,
    color: theme.colors.accent,
    fontSize: 28,
  },
  motto: {
    fontFamily: f.medium,
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  mottoG: {
    color: theme.colors.accent,
    fontFamily: f.bold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  go: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: theme.colors.accent,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 11,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  goT: {
    fontFamily: f.black,
    color: '#0a0e17',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(20,28,43,0.92)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
  },
  badgeIco: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeN: {
    fontFamily: f.black,
    color: theme.colors.textPrimary,
    fontSize: 11,
    letterSpacing: 0.6,
  },
  badgeS: {
    fontFamily: f.semibold,
    color: theme.colors.textSecondary,
    fontSize: 8,
    marginTop: 1,
  },
});

export default HeaderCard;
