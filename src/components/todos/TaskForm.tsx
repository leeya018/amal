import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, dueDate: string) => Promise<void>;
  initialDueDate?: string;
}

export function TaskForm({ visible, onClose, onSave, initialDueDate }: TaskFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(initialDueDate ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!title.trim()) {
      setError(t('todos.titlePlaceholder'));
      return;
    }
    setSaving(true);
    try {
      await onSave(title.trim(), description.trim(), dueDate);
      setTitle('');
      setDescription('');
      setDueDate(initialDueDate ?? '');
      setError('');
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl px-5 py-6">
          <Text className="text-calm-text text-xl font-bold mb-5">{t('todos.addTask')}</Text>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View className="gap-4">
              <Input
                label={t('todos.title')}
                placeholder={t('todos.titlePlaceholder')}
                value={title}
                onChangeText={setTitle}
                error={error}
                autoFocus
              />
              <Input
                label={t('todos.description')}
                placeholder={t('todos.descriptionPlaceholder')}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
              <Input
                label={t('todos.dueDate')}
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          <View className="gap-2 mt-5">
            <Button
              title={t('todos.save')}
              onPress={handleSave}
              loading={saving}
              fullWidth
            />
            <Button
              title={t('todos.cancel')}
              variant="ghost"
              onPress={onClose}
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
