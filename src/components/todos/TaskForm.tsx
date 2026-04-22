import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Touchable } from "@/components/ui/Touchable";

type Props = {
  visible:  boolean;
  onSubmit: (data: { title: string; description?: string; due_date?: string | null }) => void | Promise<void>;
  onClose:  () => void;
};

export const TaskForm = ({ visible, onSubmit, onClose }: Props) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);

  const reset = () => {
    setTitle("");
    setDescription("");
    setDueDate(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate,
    });
    reset();
    onClose();
  };

  // Simple week-ahead date picker (7 chips). Keeps the modal lean and RTL-friendly.
  const weekChips = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("he-IL", { weekday: "short", day: "2-digit", month: "2-digit" }),
    };
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable onPress={onClose} className="flex-1 bg-black/40 justify-end">
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-cream rounded-t-[32px] p-6 pb-10 shadow-2xl shadow-black/20">
            <View className="self-center w-10 h-1 rounded-full bg-ink-faint/40 mb-5" />
            <Txt variant="title" className="mb-5 text-ink" style={{ textAlign: "right" }}>
              {t("todos.newTask")}
            </Txt>

            <View className="gap-3">
              <Input label={t("todos.titleLabel")} value={title} onChangeText={setTitle} autoFocus />
              <Input
                label={t("todos.descriptionLabel")}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, paddingVertical: 12 }}
              />

              <View>
                <Txt variant="label" tone="muted" className="mb-2 px-1" style={{ textAlign: "right" }}>
                  {t("todos.dueDateLabel")}
                </Txt>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse", gap: 8 }}>
                  <DateChip active={dueDate === null} label={t("todos.noDueDate")} onPress={() => setDueDate(null)} />
                  {weekChips.map((c) => (
                    <DateChip key={c.iso} active={dueDate === c.iso} label={c.label} onPress={() => setDueDate(c.iso)} />
                  ))}
                </ScrollView>
              </View>
            </View>

            <View className="gap-2 mt-6">
              <Button label={t("common.save")}   onPress={handleSubmit} fullWidth size="lg" disabled={!title.trim()} />
              <Button label={t("common.cancel")} variant="ghost" onPress={onClose} fullWidth />
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const DateChip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
  <Touchable
    onPress={onPress}
    className={`px-3.5 py-2 rounded-full ${active ? "bg-brand-700 shadow-md shadow-black/20" : "bg-white shadow-md shadow-black/5"}`}
  >
    <Txt variant="caption" tone={active ? "inverse" : "default"} style={{ fontFamily: "Rubik_500Medium" }}>
      {label}
    </Txt>
  </Touchable>
);
