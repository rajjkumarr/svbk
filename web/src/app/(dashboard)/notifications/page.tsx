"use client";

import { Button } from "@/components/ui"
import { getNotifications } from "@/features/notifications/service/notification.service";
import { useEffect, useState } from "react";

const TABS = [
    { id: "1", label: "Template" },
    { id: "2", label: "Discount" },
  ] as const;
  
  type TabId = (typeof TABS)[number]["id"];
  
const Notifications =()=>{
    const [activeTab,setActiveTab] =useState("1")


    useEffect(()=>{
        const fetchNotifications=async()=>{
       
          const branch="hyd"
          const role="Admin"
          const response= await getNotifications(role,branch)
        //   setNotification(response)
         }
         fetchNotifications()
       },[])
    return(
        <div>
           <div
          className="flex items-center gap-1 rounded-xl border p-1"
          style={{ backgroundColor: "#f3f4f6", borderColor: "var(--app-divider)" }}
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`relative rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 w-1/2 ${
                activeTab === id
                  ? "shadow-sm"
                  : "hover:bg-[var(--app-nav-hover-bg)]"
              }`}
              style={
                activeTab === id
                  ? { backgroundColor: "var(--app-card-bg)", color: "var(--app-text-primary)" }
                  : { color: "var(--app-text-secondary)" }
              }
            >
              {label}
            </button>
          ))}
        </div>
        </div>
    )

}
export default Notifications