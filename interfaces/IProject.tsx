export interface ProjectDetails {
    projectDetailId: number;
    description: string | null;
    afterImage: string | null;
    beforeImage:string | null;
    video:string | null
  }
  
export  interface Project {
        projectId: number;
        title: string;
        cost: string;
        categoryId: number;
        categoryName: string;
        likes:number;
        messageCount:number;
        details: ProjectDetails[]
      }
    
  