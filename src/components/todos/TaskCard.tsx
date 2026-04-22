import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Todo } from '../../types/app';

interface TaskCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ todo, onToggle, onDelete }: TaskCardProps) {
  const { t } = useTranslation();

  return (
    <View
      className={`bg-white rounded-2xl border ${
        todo.completed ? 'border-gray-200' : 'border-calm-border'
      } p-4 mb-3 flex-row items-start gap-3`}
    >
      {/* Checkbox */}
      <TouchableOpacity
        onPress={() => onToggle(todo.id)}
        className={`w-6 h-6 rounded-full border-2 items-center justify-center mt-0.5 flex-shrink-0 ${
          todo.completed
            ? 'bg-primary-600 border-primary-600'
            : 'border-calm-border bg-white'
        }`}
      >
        {todo.completed && <Text className="text-white text-xs font-bold">✓</Text>}
      </TouchableOpacity>

      {/* Content */}
      <View className="flex-1">
        <Text
          className={`font-medium text-base ${
            todo.completed ? 'text-gray-400 line-through' : 'text-calm-text'
          }`}
        >
          {todo.title}
        </Text>
        {todo.description ? (
          <Text className="text-gray-500 text-sm mt-0.5" numberOfLines={2}>
            {todo.description}
          </Text>
        ) : null}
        {todo.due_date ? (
          <Text className="text-primary-500 text-xs mt-1">
            {new Date(todo.due_date).toLocaleDateString()}
          </Text>
        ) : null}
      </View>

      {/* Delete */}
      <TouchableOpacity onPress={() => onDelete(todo.id)} className="p-1 flex-shrink-0">
        <Text className="text-gray-300 text-lg">✕</Text>
      </TouchableOpacity>
    </View>
  );
}
