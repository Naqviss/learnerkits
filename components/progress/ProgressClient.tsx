"use client";
import { useEffect, useState } from "react";
import { loadProgress, rankForXp, type ProgressState } from "@/lib/progression/storage";
import type { Messages } from "@/lib/i18n/getMessages";
export function ProgressClient({m}:{m:Messages}){const[p,setP]=useState<ProgressState>({xp:0,completedMissionIds:[],bestScores:{}});useEffect(()=>setP(loadProgress()),[]);return <div className="grid3"><div className="card"><span className="muted">{m.progress.rank}</span><h3>{m.progress[rankForXp(p.xp)]}</h3></div><div className="card"><span className="muted">XP</span><h3>{p.xp}</h3></div><div className="card"><span className="muted">{m.progress.completed}</span><h3>{p.completedMissionIds.length}</h3></div></div>}
