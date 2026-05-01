import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, FadeIn, FadeInDown } from 'react-native-reanimated';
import theme from '../constants/theme';
import { insertWorkout } from '../database/db';

const f = theme.fonts;

const getIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('bench') || n.includes('press') || n.includes('squat')) return 'barbell-outline';
  if (n.includes('pulldown') || n.includes('row')) return 'arrow-down-outline';
  if (n.includes('fly') || n.includes('flies') || n.includes('raise') || n.includes('lateral')) return 'expand-outline';
  if (n.includes('curl') || n.includes('extension') || n.includes('pushdown') || n.includes('tricep')) return 'fitness-outline';
  if (n.includes('cardio') || n.includes('walk')) return 'walk-outline';
  if (n.includes('abs') || n.includes('crunch')) return 'body-outline';
  if (n.includes('calf')) return 'footsteps-outline';
  if (n.includes('hamstring') || n.includes('leg')) return 'resize-outline';
  return 'fitness-outline';
};

const formatSets = (s) => {
  if (!s) return '';
  if (s.includes('min')) return s;
  const m = s.match(/(\d+)×(.+)/);
  return m ? `${m[1]} sets · ${m[2]} reps` : s;
};

const SetRow = ({ index, reps, weight, onChangeReps, onChangeWeight, onRemove }) => (
  <Animated.View entering={FadeInDown.duration(200).delay(index * 50)} style={styles.setRow}>
    <View style={styles.setNum}><Text style={styles.setNumT}>{index + 1}</Text></View>
    <View style={styles.ig}>
      <View style={styles.iw}>
        <Text style={styles.il}>REPS</Text>
        <TextInput style={styles.inp} keyboardType="numeric" placeholder="0" placeholderTextColor="rgba(100,116,139,0.4)" value={reps} onChangeText={onChangeReps} />
      </View>
      <View style={styles.iw}>
        <Text style={styles.il}>KG</Text>
        <TextInput style={styles.inp} keyboardType="numeric" placeholder="0" placeholderTextColor="rgba(100,116,139,0.4)" value={weight} onChangeText={onChangeWeight} />
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.rm}><Ionicons name="trash-outline" size={15} color={theme.colors.danger} /></TouchableOpacity>
    </View>
  </Animated.View>
);

const ExerciseRow = ({ name, targetSets = '', index = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const [sets, setSets] = useState([]);
  const [saved, setSaved] = useState(false);
  const rot = useSharedValue(0);
  const cs = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));

  const toggle = () => {
    const n = !expanded;
    setExpanded(n);
    rot.value = withTiming(n ? 90 : 0, { duration: 250 });
  };

  const addSet = () => { setSets(p => [...p, { reps: '', weight: '' }]); setSaved(false); };
  const updateSet = (i, k, v) => { setSets(p => { const u = [...p]; u[i] = { ...u[i], [k]: v }; return u; }); setSaved(false); };
  const removeSet = (i) => { setSets(p => p.filter((_, x) => x !== i)); setSaved(false); };

  const saveSets = () => {
    const valid = sets.filter(s => s.reps && s.weight);
    if (!valid.length) { Alert.alert('No Sets', 'Add at least one complete set.'); return; }
    const d = new Date().toISOString().split('T')[0];
    valid.forEach(s => insertWorkout(d, name, 1, parseInt(s.reps, 10), parseFloat(s.weight)));
    setSaved(true);
    Alert.alert('Saved ✓', `${valid.length} set${valid.length > 1 ? 's' : ''} logged for ${name}`);
  };

  const cc = sets.filter(s => s.reps && s.weight).length;

  return (
    <View style={[styles.rc, expanded && styles.rcExp]}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.7} style={styles.rw}>
        <View style={[styles.nc, expanded && styles.ncA]}><Text style={styles.nt}>{index + 1}</Text></View>
        <View style={[styles.icw, expanded && styles.icwA]}><Ionicons name={getIcon(name)} size={20} color={theme.colors.accent} /></View>
        <View style={styles.tw}>
          <Text style={styles.en}>{name}</Text>
          <Text style={styles.es}>{formatSets(targetSets)}</Text>
        </View>
        <View style={styles.rr}>
          {cc > 0 && <View style={[styles.bg, saved && styles.bgS]}><Text style={styles.bgT}>{saved ? '✓' : cc}</Text></View>}
          <Animated.View style={[styles.aw, cs]}><Ionicons name="chevron-forward" size={15} color={theme.colors.accent} /></Animated.View>
        </View>
      </TouchableOpacity>
      {expanded && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.eb}>
          {sets.length === 0 && <Text style={styles.hint}>Tap "Add Set" to start tracking</Text>}
          {sets.map((s, i) => <SetRow key={i} index={i} reps={s.reps} weight={s.weight} onChangeReps={v => updateSet(i, 'reps', v)} onChangeWeight={v => updateSet(i, 'weight', v)} onRemove={() => removeSet(i)} />)}
          <View style={styles.ar}>
            <TouchableOpacity onPress={addSet} activeOpacity={0.7} style={styles.ab}>
              <Ionicons name="add" size={18} color={theme.colors.accent} /><Text style={styles.at}>Add Set</Text>
            </TouchableOpacity>
            {sets.length > 0 && (
              <TouchableOpacity onPress={saveSets} activeOpacity={0.8} style={[styles.sb, saved && styles.sbD]}>
                <Ionicons name={saved ? 'checkmark-circle' : 'cloud-upload-outline'} size={16} color="#0a0e17" />
                <Text style={styles.st}>{saved ? 'Saved' : 'Save'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rc: { borderBottomWidth: 1, borderBottomColor: 'rgba(30,41,59,0.6)', marginBottom: 2 },
  rcExp: { backgroundColor: 'rgba(20,28,43,0.5)', borderRadius: 20, borderBottomWidth: 0, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(34,197,94,0.12)' },
  rw: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, gap: 12 },
  nc: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: theme.colors.accent, alignItems: 'center', justifyContent: 'center' },
  ncA: { backgroundColor: theme.colors.accentDim },
  nt: { fontFamily: f.black, color: theme.colors.accent, fontSize: 12 },
  icw: { width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.accentDim, alignItems: 'center', justifyContent: 'center' },
  icwA: { backgroundColor: 'rgba(34,197,94,0.18)' },
  tw: { flex: 1 },
  en: { fontFamily: f.extrabold, color: theme.colors.textPrimary, fontSize: 15, letterSpacing: -0.2 },
  es: { fontFamily: f.medium, color: theme.colors.textSecondary, fontSize: 11, marginTop: 2 },
  rr: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bg: { backgroundColor: theme.colors.accent, borderRadius: 10, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  bgS: { backgroundColor: theme.colors.highlight },
  bgT: { fontFamily: f.black, color: '#0a0e17', fontSize: 10 },
  aw: { width: 30, height: 30, borderRadius: 15, backgroundColor: theme.colors.accentDim, alignItems: 'center', justifyContent: 'center' },
  eb: { paddingHorizontal: 16, paddingBottom: 16 },
  hint: { fontFamily: f.medium, color: theme.colors.textSecondary, fontSize: 12, textAlign: 'center', paddingVertical: 12, fontStyle: 'italic' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8 },
  setNum: { width: 28, height: 28, borderRadius: 8, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center' },
  setNumT: { fontFamily: f.black, color: theme.colors.accent, fontSize: 12 },
  ig: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  iw: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 10, paddingVertical: 8, gap: 6 },
  il: { fontFamily: f.extrabold, color: theme.colors.textSecondary, fontSize: 9, letterSpacing: 0.5 },
  inp: { flex: 1, fontFamily: f.extrabold, color: theme.colors.textPrimary, fontSize: 15, padding: 0, textAlign: 'right' },
  rm: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.1)', alignItems: 'center', justifyContent: 'center' },
  ar: { flexDirection: 'row', gap: 10, marginTop: 10 },
  ab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(34,197,94,0.2)', borderStyle: 'dashed' },
  at: { fontFamily: f.extrabold, color: theme.colors.accent, fontSize: 12 },
  sb: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, paddingHorizontal: 20, backgroundColor: theme.colors.accent, borderRadius: 12, shadowColor: theme.colors.accent, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 6 },
  sbD: { backgroundColor: theme.colors.highlight },
  st: { fontFamily: f.black, color: '#0a0e17', fontSize: 12 },
});

export default ExerciseRow;
