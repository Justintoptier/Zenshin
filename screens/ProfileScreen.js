import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../constants/theme';
import { getProfile, insertProfile, getWorkoutStats } from '../database/db';

const f = theme.fonts;

const StatCard = ({ icon, label, value, delay = 0 }) => (
  <Animated.View entering={FadeInDown.duration(400).delay(delay)} style={styles.sc}>
    <View style={styles.scI}><Ionicons name={icon} size={18} color={theme.colors.accent} /></View>
    <Text style={styles.scV}>{value}</Text>
    <Text style={styles.scL}>{label}</Text>
  </Animated.View>
);

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [stats, setStats] = useState({ totalEntries: 0, totalDays: 0, uniqueExercises: 0 });

  useFocusEffect(useCallback(() => {
    const p = getProfile();
    if (p) { setName(p.name || ''); setAge(p.age ? String(p.age) : ''); setWeight(p.weight ? String(p.weight) : ''); setGoal(p.goal || ''); }
    setStats(getWorkoutStats());
  }, []));

  const handleSave = () => {
    insertProfile(name, parseInt(age, 10) || 0, parseFloat(weight) || 0, goal);
    Alert.alert('Saved ✓', 'Profile updated.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.title}><Text style={styles.cursive}>Profile</Text></Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.avS}>
          <View style={styles.avO}>
            <LinearGradient colors={[theme.colors.accent, '#06b6d4', theme.colors.highlight]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.avG}>
              <View style={styles.avI}><Text style={styles.avL}>{name?.[0]?.toUpperCase() || '?'}</Text></View>
            </LinearGradient>
          </View>
          <Text style={styles.pn}>{name || 'Your Name'}</Text>
          <View style={styles.gp}><Ionicons name="flag" size={12} color={theme.colors.accent} /><Text style={styles.gt}>{goal || 'Set your goal'}</Text></View>
        </Animated.View>

        <View style={styles.sr}>
          <StatCard icon="barbell-outline" label="LOGGED" value={stats.totalEntries} delay={200} />
          <StatCard icon="calendar-outline" label="DAYS" value={stats.totalDays} delay={250} />
          <StatCard icon="fitness-outline" label="MOVES" value={stats.uniqueExercises} delay={300} />
        </View>

        <Animated.View entering={FadeInDown.duration(400).delay(350)} style={styles.card}>
          <View style={styles.cg} />
          <Text style={styles.ct}><Text style={styles.ctCursive}>Personal </Text>INFO</Text>
          <View style={styles.fld}><Text style={styles.fl}>NAME</Text><TextInput style={styles.inp} value={name} onChangeText={setName} placeholder="Justin" placeholderTextColor="rgba(100,116,139,0.4)" /></View>
          <View style={styles.row}>
            <View style={[styles.fld, { flex: 1 }]}><Text style={styles.fl}>AGE</Text><TextInput style={[styles.inp, styles.ic]} value={age} onChangeText={setAge} placeholder="20" keyboardType="numeric" placeholderTextColor="rgba(100,116,139,0.4)" /></View>
            <View style={[styles.fld, { flex: 1 }]}><Text style={styles.fl}>WEIGHT (KG)</Text><TextInput style={[styles.inp, styles.ic]} value={weight} onChangeText={setWeight} placeholder="68" keyboardType="numeric" placeholderTextColor="rgba(100,116,139,0.4)" /></View>
          </View>
          <View style={styles.fld}><Text style={styles.fl}>GOAL</Text><TextInput style={styles.inp} value={goal} onChangeText={setGoal} placeholder="Build lean muscle" placeholderTextColor="rgba(100,116,139,0.4)" /></View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <LinearGradient colors={[theme.colors.accent, theme.colors.highlight]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.saveG}>
              <Ionicons name="checkmark-circle" size={20} color="#0a0e17" /><Text style={styles.saveT}>Save Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },
  title: { fontFamily: f.black, color: theme.colors.textPrimary, fontSize: theme.fontSize.hero, letterSpacing: -0.8, marginBottom: theme.spacing.lg },
  cursive: { fontFamily: f.cursive, color: theme.colors.accent, fontSize: 36 },
  avS: { alignItems: 'center', marginBottom: theme.spacing.xl },
  avO: { width: 110, height: 110, borderRadius: 55, marginBottom: 14, shadowColor: theme.colors.accent, shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 4 }, elevation: 10 },
  avG: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center' },
  avI: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
  avL: { fontFamily: f.cursive, color: theme.colors.accent, fontSize: 44 },
  pn: { fontFamily: f.black, color: theme.colors.textPrimary, fontSize: theme.fontSize.xxl, letterSpacing: -0.5 },
  gp: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.colors.accentDim, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5, marginTop: 8 },
  gt: { fontFamily: f.bold, color: theme.colors.accent, fontSize: 12 },
  sr: { flexDirection: 'row', gap: 10, marginBottom: theme.spacing.xl },
  sc: { flex: 1, backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: 'rgba(34,197,94,0.1)', padding: 14, alignItems: 'center', gap: 6 },
  scI: { width: 32, height: 32, borderRadius: 10, backgroundColor: theme.colors.accentDim, alignItems: 'center', justifyContent: 'center' },
  scV: { fontFamily: f.black, color: theme.colors.textPrimary, fontSize: 22 },
  scL: { fontFamily: f.extrabold, color: theme.colors.textSecondary, fontSize: 9, letterSpacing: 1.5 },
  card: { backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, padding: theme.spacing.lg, borderWidth: 1, borderColor: 'rgba(34,197,94,0.1)', overflow: 'hidden' },
  cg: { position: 'absolute', top: -1, left: 24, right: 24, height: 2, backgroundColor: theme.colors.accent, opacity: 0.25, borderRadius: 1 },
  ct: { fontFamily: f.extrabold, color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, marginBottom: theme.spacing.md },
  ctCursive: { fontFamily: f.cursive, color: theme.colors.accent, fontSize: 16 },
  fld: { marginBottom: theme.spacing.md },
  fl: { fontFamily: f.extrabold, color: theme.colors.accent, fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  inp: { fontFamily: f.bold, backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: theme.spacing.md, paddingVertical: 14, color: theme.colors.textPrimary, fontSize: 16 },
  ic: { textAlign: 'center' },
  row: { flexDirection: 'row', gap: 10 },
  saveBtn: { marginTop: theme.spacing.xl, borderRadius: theme.radius.xl, overflow: 'hidden', shadowColor: theme.colors.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
  saveG: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  saveT: { fontFamily: f.black, color: '#0a0e17', fontSize: 15, letterSpacing: 0.5 },
});

export default ProfileScreen;
