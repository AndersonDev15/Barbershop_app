import axios from "axios"; 
 import { useState, useEffect, useCallback } from "react"; 
 import type { NotificationResponse } from "../types/notification.types"; 
 
 const BASE = "http://127.0.0.1:8090/api/notifications"; 
 const cfg = { withCredentials: true }; 
 
 export function useNotificationBell() { 
   const [notifications, setNotifications] = useState<NotificationResponse[]>([]); 
   const [unreadCount, setUnreadCount] = useState(0); 
 
   const fetchAll = useCallback(() => { 
     axios.get<NotificationResponse[]>(BASE, cfg) 
       .then(res => { 
         setNotifications(res.data.slice(0, 3)); // solo las 3 más recientes para el dropdown 
         setUnreadCount(res.data.filter(n => !n.read).length); 
       }) 
       .catch(() => {}); 
   }, []); 
 
   useEffect(() => { fetchAll(); }, [fetchAll]); 
 
   const markAsRead = (id: number) => { 
     axios.put(`${BASE}/${id}/read`, {}, cfg).then(() => { 
       setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); 
       setUnreadCount(prev => Math.max(0, prev - 1)); 
     }); 
   }; 
 
   return { notifications, unreadCount, markAsRead }; 
 } 
