import axios from "axios"; 
 import { useState, useEffect, useCallback } from "react"; 
 import type { NotificationResponse } from "../types/notification.types"; 
 
 const BASE = "http://127.0.0.1:8090/api/notifications"; 
 const cfg = { withCredentials: true }; 
 
 export function useNotifications() { 
   const [notifications, setNotifications] = useState<NotificationResponse[]>([]); 
   const [loading, setLoading] = useState(true); 
 
   const fetch = useCallback(() => { 
     setLoading(true); 
     axios.get<NotificationResponse[]>(BASE, cfg) 
       .then(res => setNotifications(res.data)) 
       .finally(() => setLoading(false)); 
   }, []); 
 
   useEffect(() => { fetch(); }, [fetch]); 
 
   const markAsRead = (id: number) => { 
     axios.put(`${BASE}/${id}/read`, {}, cfg).then(() => { 
       setNotifications(prev => 
         prev.map(n => n.id === id ? { ...n, read: true } : n) 
       ); 
     }); 
   }; 
 
   const markAllAsRead = () => { 
     axios.put(`${BASE}/read-all`, {}, cfg).then(() => { 
       setNotifications(prev => prev.map(n => ({ ...n, read: true }))); 
     }); 
   }; 
 
   return { notifications, loading, markAsRead, markAllAsRead }; 
 } 
