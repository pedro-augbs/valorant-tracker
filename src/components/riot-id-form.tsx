import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { parseRiotId } from '../lib/player';
import { colors } from '../lib/theme';
import { Action, styles } from './ui';

export function RiotIdForm({ label, onSubmit, initial = '', disabled = false, hint }: {
  label: string; onSubmit: (value: string) => void; initial?: string; disabled?: boolean; hint?: string;
}) {
  const [value, setValue] = useState(initial);
  const [invalid, setInvalid] = useState(false);

  function submit() {
    if (disabled) return;
    const parsed = parseRiotId(value);
    setInvalid(!parsed);
    if (parsed) onSubmit(parsed.name + '#' + parsed.tag);
  }

  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.label}>Riot ID</Text>
      <TextInput accessibilityLabel="Riot ID" value={value} onChangeText={(next) => { setValue(next); setInvalid(false); }}
        placeholder="nome#tag" placeholderTextColor={colors.muted} style={styles.input}
        autoCapitalize="none" autoCorrect={false} maxLength={129} editable={!disabled}
        returnKeyType="go" onSubmitEditing={submit} />
      {invalid && <Text accessibilityLiveRegion="polite" style={styles.error}>Digite o Riot ID no formato nome#tag.</Text>}
      {hint && <Text style={styles.muted}>{hint}</Text>}
      <Action label={label} onPress={submit} disabled={disabled} />
    </View>
  );
}
