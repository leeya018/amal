import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

interface ActionItem {
  title: string;
  description: string;
}

interface ActionItemsModalProps {
  visible: boolean;
  items: ActionItem[];
  loading: boolean;
  onAdd: (items: ActionItem[]) => Promise<void>;
  onClose: () => void;
}

export function ActionItemsModal({
  visible,
  items,
  loading,
  onAdd,
  onClose,
}: ActionItemsModalProps) {
  const { t } = useTranslation();
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    try {
      await onAdd(items);
      onClose();
    } finally {
      setAdding(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl px-5 py-6 max-h-[70%]">
          <Text className="text-calm-text text-xl font-bold mb-4">
            {t('agent.extractTodos')}
          </Text>

          {loading ? (
            <ActivityIndicator color="#7c3aed" className="my-8" />
          ) : items.length === 0 ? (
            <Text className="text-gray-500 text-center py-8">{t('agent.noActionItems')}</Text>
          ) : (
            <ScrollView className="mb-4">
              {items.map((item, i) => (
                <View key={i} className="bg-calm-surface rounded-xl p-3 mb-2">
                  <Text className="text-calm-text font-medium">{item.title}</Text>
                  {item.description ? (
                    <Text className="text-gray-500 text-sm mt-1">{item.description}</Text>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          )}

          <View className="gap-2">
            <Button
              title={t('todos.save')}
              onPress={handleAdd}
              loading={adding}
              disabled={items.length === 0 || loading}
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
