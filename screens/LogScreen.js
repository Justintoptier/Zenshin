import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ExerciseRow from '../components/ExerciseRow';
import theme from '../constants/theme';
import { getTodayWorkout } from '../constants/workoutSplit';

const f = theme.fonts;

const LogScreen = () => {
  const { name, muscleGroups, exerciseList } = getTodayWorkout();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.title}>
            <Text style={styles.cursive}>Log </Text>Workout
          </Text>
          <Text style={styles.subtitle}>
            Track your sets for today's {name} session
          </Text>
        </Animated.View>

        {/* Workout info pill */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.infoPill}>
          <Ionicons name="fitness" size={16} color={theme.colors.accent} />
          <Text style={styles.infoLabel}>{name.toUpperCase()}</Text>
          <View style={styles.infoDot} />
          <Text style={styles.infoSub}>{muscleGroups}</Text>
          <View style={styles.infoDot} />
          <Text style={styles.infoSub}>{exerciseList.length} exercises</Text>
        </Animated.View>

        {/* Instructions */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.tipCard}>
          <Ionicons name="information-circle" size={16} color={theme.colors.accent} />
          <Text style={styles.tipText}>
            Tap any exercise → Add sets → Enter reps & weight → Hit <Text style={styles.tipBold}>Save</Text>
          </Text>
        </Animated.View>

        {/* Section header */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>EXERCISES</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{exerciseList.length}</Text>
          </View>
        </Animated.View>

        {/* Exercise list — same component as Home */}
        <View>
          {exerciseList.map((exercise, idx) => (
            <ExerciseRow
              key={exercise.name}
              name={exercise.name}
              targetSets={exercise.sets}
              index={idx}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },
  title: {
    fontFamily: f.black,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.hero,
    letterSpacing: -0.8,
  },
  cursive: {
    fontFamily: f.cursive,
    color: theme.colors.accent,
    fontSize: 34,
  },
  subtitle: {
    fontFamily: f.medium,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    marginTop: 4,
    marginBottom: theme.spacing.md,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.15)',
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  infoLabel: {
    fontFamily: f.black,
    color: theme.colors.textPrimary,
    fontSize: 12,
    letterSpacing: 1,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textSecondary,
  },
  infoSub: {
    fontFamily: f.semibold,
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.accentDim,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.15)',
  },
  tipText: {
    flex: 1,
    fontFamily: f.medium,
    color: theme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  tipBold: {
    fontFamily: f.bold,
    color: theme.colors.accent,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: f.extrabold,
    color: theme.colors.textSecondary,
    fontSize: 12,
    letterSpacing: 2.5,
  },
  countPill: {
    backgroundColor: theme.colors.accentDim,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  countText: {
    fontFamily: f.extrabold,
    color: theme.colors.accent,
    fontSize: 11,
  },
});

export default LogScreen;
