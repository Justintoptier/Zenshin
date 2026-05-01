import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import HeaderCard from '../components/HeaderCard';
import theme from '../constants/theme';
import { getTodayWorkout } from '../constants/workoutSplit';
import { getWorkoutStreak, getLastWorkout, getWeeklyStats } from '../database/db';

const f = theme.fonts;

/* ── Muscle group tips ─────────────────────────── */
const FOCUS_TIPS = {
  Push: 'Focus on chest & shoulder contractions. Control the negative!',
  Pull: 'Squeeze your back at the top. Use straps if grip fails first.',
  Legs: 'Drive through heels on squats. Full depth = full gains.',
  Upper: 'Supersets work great today. Chest ↔ Back for max pump.',
  Lower: 'Don\'t skip hamstrings! Balance quads with posterior chain.',
  Rest: 'Recovery is growth. Stretch, hydrate, and sleep well tonight.',
};

/* ── Format volume ─────────────────────────── */
const fmtVol = (v) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return String(v);
};

/* ── Streak Card ───────────────────────────── */
const WorkoutStreakCard = ({ streak, delay }) => (
  <Animated.View entering={FadeInDown.duration(400).delay(delay)} style={styles.card}>
    <View style={styles.cardRow}>
      <View style={styles.cardIconWrap}>
        <Ionicons name="flame" size={20} color="#f97316" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardLabel}>WORKOUT STREAK</Text>
        <View style={styles.streakRow}>
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakUnit}>day{streak !== 1 ? 's' : ''}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.cardSub}>
      {streak === 0 ? 'Start your streak today!' : streak < 3 ? 'Keep it going — momentum builds!' : streak < 7 ? 'You\'re on fire! Don\'t break the chain.' : 'Beast mode activated. Unstoppable! 🔥'}
    </Text>
    {streak > 0 && (
      <View style={styles.streakDots}>
        {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
          <View key={i} style={styles.streakDot} />
        ))}
      </View>
    )}
  </Animated.View>
);

/* ── Last Workout Card ─────────────────────── */
const LastWorkoutCard = ({ last, delay }) => (
  <Animated.View entering={FadeInDown.duration(400).delay(delay)} style={styles.card}>
    <View style={styles.cardRow}>
      <View style={[styles.cardIconWrap, { backgroundColor: 'rgba(99,102,241,0.12)' }]}>
        <Ionicons name="time-outline" size={20} color="#818cf8" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardLabel}>LAST WORKOUT</Text>
        {last ? (
          <>
            <Text style={styles.cardTitle}>{last.exercise}</Text>
            <Text style={styles.cardSub}>{last.reps} reps · {last.weight} kg</Text>
          </>
        ) : (
          <Text style={styles.cardSub}>No workouts logged yet</Text>
        )}
      </View>
    </View>
  </Animated.View>
);

/* ── Today Focus Card ──────────────────────── */
const TodayFocusCard = ({ splitName, delay }) => (
  <Animated.View entering={FadeInDown.duration(400).delay(delay)} style={styles.card}>
    <View style={styles.cardRow}>
      <View style={[styles.cardIconWrap, { backgroundColor: theme.colors.accentDim }]}>
        <Ionicons name="bulb" size={20} color={theme.colors.accent} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardLabel}>TODAY'S FOCUS</Text>
        <Text style={styles.cardTitle}>{splitName} Day</Text>
      </View>
    </View>
    <View style={styles.tipWrap}>
      <Text style={styles.tipText}>{FOCUS_TIPS[splitName] || FOCUS_TIPS.Rest}</Text>
    </View>
  </Animated.View>
);

/* ── Weekly Snapshot Card ──────────────────── */
const WeeklySnapshotCard = ({ weekly, delay }) => (
  <Animated.View entering={FadeInDown.duration(400).delay(delay)} style={styles.wideCard}>
    <View style={styles.glow} />
    <Text style={styles.wideTitle}>
      <Text style={styles.cursive}>Weekly </Text>SNAPSHOT
    </Text>
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Ionicons name="calendar-outline" size={18} color={theme.colors.accent} />
        <Text style={styles.statVal}>{weekly.workoutDays}</Text>
        <Text style={styles.statLbl}>Workouts</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Ionicons name="trending-up-outline" size={18} color={theme.colors.accent} />
        <Text style={styles.statVal}>{fmtVol(weekly.totalVolume)}</Text>
        <Text style={styles.statLbl}>Volume (kg)</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Ionicons name="trophy-outline" size={18} color="#eab308" />
        <Text style={styles.statVal}>{weekly.bestLift ? `${weekly.bestLift.maxWeight}` : '—'}</Text>
        <Text style={styles.statLbl}>{weekly.bestLift ? weekly.bestLift.exercise : 'Best Lift'}</Text>
      </View>
    </View>
  </Animated.View>
);

/* ── Home Screen ───────────────────────────── */
const HomeScreen = ({ navigation }) => {
  const { name, muscleGroups } = getTodayWorkout();
  const today = new Date();
  const dateText = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

  const [streak, setStreak] = useState(0);
  const [last, setLast] = useState(null);
  const [weekly, setWeekly] = useState({ workoutDays: 0, totalVolume: 0, bestLift: null });

  useFocusEffect(
    useCallback(() => {
      setStreak(getWorkoutStreak());
      setLast(getLastWorkout());
      setWeekly(getWeeklyStats());
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.topRow}>
          <Text style={styles.dateLabel}>{dateText}</Text>
          <View style={styles.avatar}>
            <LinearGradient colors={[theme.colors.accent, theme.colors.highlight]} style={styles.avatarGrad}>
              <View style={styles.avatarInner}><Text style={styles.avatarText}>J</Text></View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Hero card (unchanged) */}
        <HeaderCard name="Justin" splitLabel={name} muscleGroups={muscleGroups} onStart={() => navigation?.navigate('Log')} />

        {/* Dashboard cards */}
        <View style={styles.cardGrid}>
          <WorkoutStreakCard streak={streak} delay={200} />
          <LastWorkoutCard last={last} delay={280} />
        </View>

        <TodayFocusCard splitName={name} delay={360} />
        <WeeklySnapshotCard weekly={weekly} delay={440} />

        {/* Quick Start Button */}
        <Animated.View entering={FadeInDown.duration(400).delay(520)}>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => navigation?.navigate('Log')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[theme.colors.accent, theme.colors.highlight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startGrad}
            >
              <Ionicons name="play" size={20} color="#0a0e17" />
              <Text style={styles.startText}>Start Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ── Styles ─────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },

  /* Top row */
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md },
  dateLabel: { fontFamily: f.bold, color: theme.colors.textSecondary, fontSize: 12, letterSpacing: 1.6 },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  avatarGrad: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarInner: { width: 34, height: 34, borderRadius: 17, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: f.black, color: theme.colors.textPrimary, fontSize: 15 },

  /* Card grid (2-col) */
  cardGrid: { flexDirection: 'row', gap: 12, marginTop: theme.spacing.lg },

  /* Standard card */
  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.1)',
    marginBottom: 12,
  },
  cardRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(249,115,22,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardLabel: { fontFamily: f.extrabold, color: theme.colors.textSecondary, fontSize: 9, letterSpacing: 1.5, marginBottom: 4 },
  cardTitle: { fontFamily: f.bold, color: theme.colors.textPrimary, fontSize: 13, marginBottom: 2 },
  cardSub: { fontFamily: f.medium, color: theme.colors.textSecondary, fontSize: 11, marginTop: 6, lineHeight: 15 },

  /* Streak extras */
  streakRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  streakNum: { fontFamily: f.black, color: theme.colors.textPrimary, fontSize: 28, lineHeight: 32 },
  streakUnit: { fontFamily: f.semibold, color: theme.colors.textSecondary, fontSize: 12 },
  streakDots: { flexDirection: 'row', gap: 5, marginTop: 10 },
  streakDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.accent },

  /* Tip */
  tipWrap: {
    marginTop: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tipText: { fontFamily: f.medium, color: theme.colors.textSecondary, fontSize: 12, lineHeight: 17, fontStyle: 'italic' },

  /* Wide card (weekly) */
  wideCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.12)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  glow: { position: 'absolute', top: -1, left: 20, right: 20, height: 2, backgroundColor: theme.colors.accent, opacity: 0.25, borderRadius: 1 },
  wideTitle: { fontFamily: f.extrabold, color: theme.colors.textSecondary, fontSize: 12, letterSpacing: 2, marginBottom: 14 },
  cursive: { fontFamily: f.cursive, color: theme.colors.accent, fontSize: 16 },

  /* Stats row */
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statVal: { fontFamily: f.black, color: theme.colors.textPrimary, fontSize: 20 },
  statLbl: { fontFamily: f.medium, color: theme.colors.textSecondary, fontSize: 10, textAlign: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: theme.colors.border },

  /* Start button */
  startBtn: {
    marginTop: 8,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  startGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 17,
  },
  startText: { fontFamily: f.black, color: '#0a0e17', fontSize: 16, letterSpacing: 0.5 },
});

export default HomeScreen;
