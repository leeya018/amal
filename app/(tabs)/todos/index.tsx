import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'react-native-calendars';
import { TaskCard } from '../../../src/components/todos/TaskCard';
import { TaskForm } from '../../../src/components/todos/TaskForm';
import { useTodos } from '../../../src/hooks/useTodos';
import { useLanguage } from '../../../src/contexts/LanguageContext';

type ViewMode = 'list' | 'calendar';

export default function TodosScreen() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodos();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showForm, setShowForm] = useState(false);

  const filtered = todos.filter((t) =>
    viewMode === 'calendar' ? t.due_date === selectedDate : true
  );

  // Build marked dates for calendar (dots where tasks exist)
  const markedDates: Record<string, { marked: boolean; selected?: boolean; selectedColor?: string }> = {};
  todos.forEach((t) => {
    if (t.due_date) {
      markedDates[t.due_date] = { marked: true };
    }
  });
  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] ?? {}),
    selected: true,
    selectedColor: '#7c3aed',
  };

  return (
    <SafeAreaView className="flex-1 bg-calm-bg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-calm-border bg-white">
        <Text className="text-xl font-bold text-calm-text">{t('todos.tabTitle')}</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl ${viewMode === 'list' ? 'bg-primary-600' : 'bg-calm-surface'}`}
          >
            <Text className={`text-xs font-medium ${viewMode === 'list' ? 'text-white' : 'text-calm-muted'}`}>
              {t('todos.list')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-xl ${viewMode === 'calendar' ? 'bg-primary-600' : 'bg-calm-surface'}`}
          >
            <Text className={`text-xs font-medium ${viewMode === 'calendar' ? 'text-white' : 'text-calm-muted'}`}>
              {t('todos.calendar')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar (shown in calendar mode) */}
      {viewMode === 'calendar' && (
        <Calendar
          current={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#7c3aed',
            todayTextColor: '#9333ea',
            arrowColor: '#7c3aed',
            dotColor: '#7c3aed',
            textDayFontFamily: 'Rubik-Regular',
            textMonthFontFamily: 'Rubik-Bold',
            textDayHeaderFontFamily: 'Rubik-Medium',
            calendarBackground: '#ffffff',
            backgroundColor: '#ffffff',
          }}
          style={{ borderBottomWidth: 1, borderBottomColor: '#e9d5ff' }}
        />
      )}

      {/* Task list */}
      {loading ? (
        <ActivityIndicator color="#7c3aed" className="mt-10" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 py-4"
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-16">
              {viewMode === 'calendar' ? t('todos.noTasks') : t('todos.noTasksAll')}
            </Text>
          }
          renderItem={({ item }) => (
            <TaskCard
              todo={item}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => setShowForm(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary-600 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.85}
      >
        <Text className="text-white text-3xl leading-none">+</Text>
      </TouchableOpacity>

      <TaskForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        initialDueDate={viewMode === 'calendar' ? selectedDate : undefined}
        onSave={async (title, description, dueDate) => {
          await addTodo(title, description || undefined, dueDate || undefined);
        }}
      />
    </SafeAreaView>
  );
}
