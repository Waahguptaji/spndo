import apiFetch from "../apiClient";

export type GoalResponse = {
  id:string;
  userId:string;
  title:string;
  target_amount:number;
  deadline: Date;
  progress_amount:number;
  status: 'active' | 'completed' | 'cancelled'| 'paused';
  created_at: string;
  updated_at: string;
}
export type GoalInput = {
  title : string;
  target_amount:number;
  deadline: string ;
  status: string;
  progress_amount:number;


}

export const getgoal = async () : Promise<GoalResponse[]>=>{
  return apiFetch("/goals",{
    method:"GET",
    
  })
}

export const addGoal = async(data:GoalInput):Promise<GoalResponse> =>{
  return apiFetch("/goals",{
    method:"POST",
    body:data
  })
}
export const delGoal=async(id:string):Promise<GoalResponse>=>{
  return apiFetch(`/goals/${id}`,{
    method:"DELETE"
  })
}
export const updateGoal = async(id:string,data:GoalInput):Promise<GoalResponse> =>{
  return apiFetch(`/goals/${id}`,{
    method : "PATCH",
    body:data
  })
}


