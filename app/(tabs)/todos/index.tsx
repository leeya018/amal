import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Touchable } from "@/components/ui/Touchable";
import { TaskCard } from "@/components/todos/TaskCard";
import { TaskForm } from "@/components/todos/TaskForm";
import { useTodos } from "@/hooks/useTodos";

type Filter = "all" | "today";

const isToday = (iso: string | null): boolean => {
  if (!iso) return false;
  const today = new Date();
  const d = new Date(iso);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth()    === today.getMonth()    &&
    d.getDate()     === today.getDate()
  );
};

export default function TodosScreen() {
  const { t } = useTranslation();
  const { items, loading, create, toggle, remove, refresh } = useTodos();
  const [formOpen, setFormOpen] = useState(false);
  const [filter,   setFilter]   = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "today") return items.filter((i) => isToday(i.due_date));
    return items;
  }, [items, filter]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      <View className="px-6 pt-2 pb-3">
        <View className="flex-row-reverse items-center justify-between">
          <Txt variant="title" className="text-ink" style={{ textAlign: "right" }}>
            {t("todos.title")}
          </Txt>
          <Touchable
            onPress={() => setFormOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={t("todos.newTask")}
            className="w-11 h-11 rounded-full bg-accent-500 items-center justify-center shadow-lg shadow-accent-500/40"
            scaleTo={0.9}
          >
            <Ionicons name="add" size={26} color="#FFFFFF" />
          </Touchable>
        </View>

        <View className="flex-row-reverse mt-5 gap-2">
          <FilterChip active={filter === "all"}   label={t("todos.allTasks")} onPress={() => setFilter("all")} />
          <FilterChip active={filter === "today"} label={t("todos.today")}    onPress={() => setFilter("today")} />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 112 }}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-20 px-8">
              <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-5 shadow-xl shadow-black/5">
                <Ionicons name="leaf-outline" size={40} color="#8E8E93" />
              </View>
              <Txt variant="body" tone="muted" style={{ textAlign: "center" }}>
                {t("todos.empty")}
              </Txt>
            </View>
          ) : null
        }
        renderItem={({ item }) => <TaskCard todo={item} onToggle={toggle} onDelete={remove} />}
      />

      <TaskForm
        visible={formOpen}
        onSubmit={(data) => create(data)}
        onClose={() => setFormOpen(false)}
      />
    </SafeAreaView>
  );
}

const FilterChip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
  <Touchable
    onPress={onPress}
    className={`px-4 py-2 rounded-full ${active ? "bg-brand-700 shadow-md shadow-black/20" : "bg-white shadow-md shadow-black/5"}`}
  >
    <Txt variant="caption" tone={active ? "inverse" : "default"} style={{ fontFamily: "Rubik_500Medium" }}>
      {label}
    </Txt>
  </Touchable>
);
