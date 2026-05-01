import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../constants/theme';
import { getWorkoutsByDate } from '../database/db';

const f = theme.fonts;

const groupData = (rows) => {
  const byDate = {};
  rows.forEach((r) => {
    if (!byDate[r.date]) byDate[r.date] = {};
    if (!byDate[r.date][r.exercise]) byDate[r.date][r.exercise] = [];
    byDate[r.date][r.exercise].push(r);
  });
  return Object.entries(byDate).map(([date, exMap]) => ({
    date,
    exercises: Object.entries(exMap).map(([nm, sets]) => ({ name: nm, sets })),
  }));
};

const fmtDate = (d) => {
  const today = new Date().toISOString().split('T')[0];
  const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (d === today) return 'TODAY';
  if (d === yest) return 'YESTERDAY';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
};

const DayCard = ({ day, index }) => {
  const [openEx, setOpenEx] = useState(null);
  return (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 80)} style={styles.dayCard}>
      <View style={styles.glow} />
      <View style={styles.dayH}>
        <View style={styles.dayIco}><Ionicons name="calendar" size={14} color={theme.colors.accent} /></View>
        <Text style={styles.dayT}>{fmtDate(day.date)}</Text>
        <View style={styles.pill}><Text style={styles.pillT}>{day.exercises.length} exercises</Text></View>
      </View>
      {day.exercises.map((ex, ei) => (
        <View key={ex.name}>
          <TouchableOpacity
            style={[styles.exRow, ei === day.exercises.length - 1 && openEx !== ei && { borderBottomWidth: 0 }]}
            onPress={() => setOpenEx(openEx === ei ? null : ei)}
            activeOpacity={0.7}
          >
            <View style={styles.exDot} />
            <View style={styles.exInfo}>
              <Text style={styles.exN}>{ex.name}</Text>
              <Text style={styles.exS}>{ex.sets.length} set{ex.sets.length > 1 ? 's' : ''} logged</Text>
            </View>
            <Ionicons name={openEx === ei ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {openEx === ei && (
            <Animated.View entering={FadeIn.duration(200)} style={styles.setList}>
              <View style={styles.setHeader}>
                <Text style={[styles.setHT, { flex: 0.5 }]}>#</Text>
                <Text style={styles.setHT}>REPS</Text>
                <Text style={styles.setHT}>WEIGHT</Text>
              </View>
              {ex.sets.map((s, si) => (
                <View key={s.id} style={[styles.setItem, si === ex.sets.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.setIdx}><Text style={styles.setIdxT}>{si + 1}</Text></View>
                  <View style={styles.setVal}><Text style={styles.setValT}>{s.reps}</Text><Text style={styles.setUnit}>reps</Text></View>
                  <View style={styles.setVal}><Text style={styles.setValT}>{s.weight}</Text><Text style={styles.setUnit}>kg</Text></View>
                </View>
              ))}
            </Animated.View>
          )}
        </View>
      ))}
    </Animated.View>
  );
};

const ProgressScreen = () => {
  const [data, setData] = useState([]);
  useFocusEffect(useCallback(() => { setData(groupData(getWorkoutsByDate())); }, []));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.title}><Text style={styles.cursive}>Progress</Text></Text>
          <Text style={styles.subtitle}>Day-by-day workout history</Text>
        </Animated.View>
        {data.length === 0 && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.emptyW}>
            <View style={styles.emptyIco}><Ionicons name="barbell-outline" size={40} color={theme.colors.accent} /></View>
            <Text style={styles.emptyT}>No workouts yet</Text>
            <Text style={styles.emptyS}>Log exercises and they'll show up here</Text>
          </Animated.View>
        )}
        {data.map((day, i) => <DayCard key={day.date} day={day} index={i} />)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },
  title: { fontFamily: f.black, color: theme.colors.textPrimary, fontSize: theme.fontSize.hero, letterSpacing: -0.8 },
  cursive: { fontFamily: f.cursive, color: theme.colors.accent, fontSize: 36 },
  subtitle: { fontFamily: f.medium, color: theme.colors.textSecondary, fontSize: theme.fontSize.md, marginTop: 4, marginBottom: theme.spacing.xl },
  emptyW: { alignItems: 'center', paddingVertical: 80, gap: 12 },
  emptyIco: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.accentDim, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyT: { fontFamily: f.extrabold, color: theme.colors.textPrimary, fontSize: theme.fontSize.lg },
  emptyS: { fontFamily: f.medium, color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  dayCard: { backgroundColor: theme.colors.card, borderRadius: 22, padding: theme.spacing.md, borderWidth: 1, borderColor: 'rgba(34,197,94,0.1)', marginBottom: 14, overflow: 'hidden' },
  glow: { position: 'absolute', top: -1, left: 20, right: 20, height: 2, backgroundColor: theme.colors.accent, opacity: 0.25, borderRadius: 1 },
  dayH: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  dayIco: { width: 28, height: 28, borderRadius: 8, backgroundColor: theme.colors.accentDim, alignItems: 'center', justifyContent: 'center' },
  dayT: { flex: 1, fontFamily: f.black, color: theme.colors.textPrimary, fontSize: 14, letterSpacing: 1.2 },
  pill: { backgroundColor: theme.colors.accentDim, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  pillT: { fontFamily: f.bold, color: theme.colors.accent, fontSize: 10 },
  exRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(30,41,59,0.5)', gap: 10 },
  exDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.accent },
  exInfo: { flex: 1 },
  exN: { fontFamily: f.bold, color: theme.colors.textPrimary, fontSize: 14 },
  exS: { fontFamily: f.medium, color: theme.colors.textSecondary, fontSize: 11, marginTop: 2 },
  setList: { marginLeft: 18, marginBottom: 8, backgroundColor: theme.colors.surface, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: theme.colors.border },
  setHeader: { flexDirection: 'row', marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  setHT: { flex: 1, fontFamily: f.extrabold, color: theme.colors.textSecondary, fontSize: 9, letterSpacing: 1.5, textAlign: 'center' },
  setItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(30,41,59,0.4)' },
  setIdx: { flex: 0.5, alignItems: 'center' },
  setIdxT: { fontFamily: f.black, color: theme.colors.accent, fontSize: 13 },
  setVal: { flex: 1, alignItems: 'center' },
  setValT: { fontFamily: f.black, color: theme.colors.textPrimary, fontSize: 18 },
  setUnit: { fontFamily: f.medium, color: theme.colors.textSecondary, fontSize: 9, marginTop: 1 },
});

export default ProgressScreen;
