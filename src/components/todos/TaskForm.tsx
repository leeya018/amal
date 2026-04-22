import { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Props = {
  visible: boolean;
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
      <Pressable onPress={onClose} className="flex-1 bg-black/50 justify-end">
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-cream rounded-t-3xl p-6 pb-10">
          <View className="self-center w-12 h-1 rounded-full bg-brand-100 mb-4" />
          <Txt variant="title" className="mb-4" style={{ textAlign: "right" }}>
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
              style={{ minHeight: 80 }}
            />

            <View>
              <Txt variant="label" tone="muted" className="mb-2 px-1" style={{ textAlign: "right" }}>
                {t("todos.dueDateLabel")}
              </Txt>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row-reverse", gap: 8 }}>
                <Pressable
                  onPress={() => setDueDate(null)}
                  className={`px-3 py-2 rounded-full border ${dueDate === null ? "bg-brand-700 border-brand-700" : "bg-white border-brand-100"}`}
                >
                  <Txt variant="caption" tone={dueDate === null ? "inverse" : "default"}>
                    {t("todos.noDueDate")}
                  </Txt>
                </Pressable>
                {weekChips.map((c) => {
                  const active = dueDate === c.iso;
                  return (
                    <Pressable
                      key={c.iso}
                      onPress={() => setDueDate(c.iso)}
                      className={`px-3 py-2 rounded-full border ${active ? "bg-brand-700 border-brand-700" : "bg-white border-brand-100"}`}
                    >
                      <Txt variant="caption" tone={active ? "inverse" : "default"}>
                        {c.label}
                      </Txt>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          <View className="gap-2 mt-6">
            <Button label={t("common.save")}   onPress={handleSubmit} fullWidth size="lg" disabled={!title.trim()} />
            <Button label={t("common.cancel")} variant="ghost" onPress={onClose} fullWidth />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
