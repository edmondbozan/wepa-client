export interface ProjectDetails {
    projectDetailId: number;
    description: string;
    afterImage: boolean;
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
    
  