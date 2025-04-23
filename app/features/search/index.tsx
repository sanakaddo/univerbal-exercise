import { useNavigation } from '@react-navigation/native';
import { useAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import React, { ReactNode, useRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { inputValue$, suggestions$ } from './state';


import { appRouteNames } from '@/routes'; 

export type SearchProps = {
  style?: StyleProp<ViewStyle>;
};

export function Search({ style }: SearchProps): ReactNode {
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useAtom(inputValue$);
  const suggestions = useAtomValue(loadable(suggestions$));
  const navigation = useNavigation();

  const handleSelect = (item: { id: string; title: string; type: 'movie' | 'tv-series' }) => {
    setInputValue('');
    if (item.type === 'movie') {
      navigation.navigate(appRouteNames.movie, { id: item.id });
    } else {
      navigation.navigate(appRouteNames.tvSeries, { id: item.id });
    }
  };

  return (
    <View style={[searchStyles.root, style]}>
      <TextInput
        ref={inputRef}
        style={searchStyles.input}
        placeholder="Search..."
        placeholderTextColor="#888"
        onChangeText={setInputValue}
        value={inputValue}
      />

      {!!inputValue && suggestions.state === 'hasData' && (
        <ScrollView style={searchStyles.suggestions} keyboardShouldPersistTaps="handled">
          {suggestions.data.map((suggestion, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelect(suggestion)}
              style={searchStyles.suggestionEntry}
            >
              <Text style={searchStyles.suggestionText}>{suggestion.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const searchStyles = StyleSheet.create({
  root: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  input: {
    height: 42,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
  },
  suggestions: {
    position: 'absolute',
    top: 54,
    left: 16,
    right: 16,
    maxHeight: 150,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 10,
    elevation: 4,
  },
  suggestionEntry: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
});
