import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./use-auth";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications
  const query = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mark single notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  // Mark all as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  // Insert a new notification (Helper for system events)
  const createNotification = useMutation({
    mutationFn: async (newNotification: Omit<Notification, "id" | "created_at" | "is_read">) => {
      const { error } = await supabase
        .from("notifications")
        .insert([newNotification]);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      // If we are inserting a notification for OURSELVES, invalidate. 
      // If it's for someone else (admin), they'll get it on their refetch interval.
      if (variables.user_id === user?.id) {
        queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      }
    }
  });

  return {
    ...query,
    markAsRead,
    markAllAsRead,
    createNotification,
    unreadCount: query.data?.filter(n => !n.is_read).length || 0,
  };
}
