import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import type { Todo } from "@/types/app";

type Props = {
  todo: Todo;
  onToggle: (t: Todo) => void;
  onDelete: (id: string) => void;
};

export const TaskCard = ({ todo, onToggle, onDelete }: Props) => {
  const { t } = useTranslation();
  const due = todo.due_date
    ? new Date(todo.due_date).toLocaleDateString("he-IL", { day: "2-digit", month: "short" })
    : null;

  return (
    <View className="bg-white rounded-2xl border border-brand-100 p-4 mb-2 flex-row-reverse items-start gap-3">
      <Pressable
        onPress={() => onToggle(todo)}
        accessibilityRole="checkbox"
        accessibilityLabel={todo.completed ? t("todos.markUndone") : t("todos.markDone")}
        accessibilityState={{ checked: todo.completed }}
        className={`w-7 h-7 rounded-full items-center justify-center border-2 ${todo.completed ? "bg-success border-success" : "border-brand-200"}`}
      >
        {todo.completed ? <Ionicons name="checkmark" size={16} color="#FAF5F0" /> : null}
      </Pressable>

      <View className="flex-1">
        <Txt
          variant="heading"
          className={todo.completed ? "line-through text-ink-faint" : ""}
          style={{ textAlign: "right" }}
        >
          {todo.title}
        </Txt>
        {todo.description ? (
          <Txt variant="caption" tone="muted" className="mt-0.5" style={{ textAlign: "right" }}>
            {todo.description}
          </Txt>
        ) : null}
        {due ? (
          <View className="flex-row-reverse items-center gap-1 mt-2">
            <Ionicons name="calendar-outline" size={12} color="#6B5C66" />
            <Txt variant="caption" tone="muted">{due}</Txt>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={() => onDelete(todo.id)}
        accessibilityRole="button"
        accessibilityLabel={t("common.delete")}
        className="w-8 h-8 items-center justify-center active:bg-brand-50 rounded-full"
      >
        <Ionicons name="close" size={18} color="#A89AA2" />
      </Pressable>
    </View>
  );
};
