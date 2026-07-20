import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/auth-context'
import { subscribeActivity } from '../services/activityLogService'
import type { ActivityLogEntry } from '../types/activity'
import { getFriendlyFirebaseError } from '../utils/firebaseErrors'
export function useActivityLog(){const{user}=useAuth(),[entries,setEntries]=useState<ActivityLogEntry[]>([]),[limit,setLimit]=useState(20),[loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null);useEffect(()=>{if(!user)return;return subscribeActivity(user.uid,limit,value=>{setEntries(value);setLoading(false)},cause=>{setError(getFriendlyFirebaseError(cause));setLoading(false)})},[user,limit]);const hasMore=entries.length===limit;return{entries,loading,error,hasMore,loadMore:()=>setLimit(value=>value+20),activeDays:useMemo(()=>new Set(entries.map(item=>item.createdAt?.toDate?.().toISOString().slice(0,10))).size,[entries])}}
