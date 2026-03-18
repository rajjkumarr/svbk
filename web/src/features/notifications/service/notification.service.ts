import { getNotificationApi } from "../api/notification.api";

export async function getNotifications(role:string,branch:string){
   const data= await getNotificationApi(role,branch)
   console.log(data,"ooooooo")
   return data
}