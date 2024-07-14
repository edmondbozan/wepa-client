export interface ProjectDetails {
    projectDetailId: number;
    description: string | null;
    afterImage: string | null;
    beforeImage:string | null;
    video:string | null
  }
  

  export interface ProjectDisplayDetails {
    projectDetailId: number;
    description: string | null;
    images : Images | null
    video:string | null
  }


export interface Images{
  afterImage: string | null;
  beforeImage:string | null; 
} 

export  interface Project {
        userName:string;
        userType:string;
        projectId: number;
        title: string;
        cost: string;
        categoryId: number;
        categoryName: string;
        likes:number;
        messageCount:number;
        details: ProjectDetails[]
      }



    
  