  

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
        enabled:boolean;
        userId:number;
        userName:string;
        userType:string;
        licenseNumber:string;
        projectId: number;
        title: string;
        cost: string;
        categoryId: number;
        categoryName: string;
        likes:number;
        messageCount:number;
        phoneNumber:string;
        message:string;
        details: ProjectDetails[]
      }

      export interface ProjectDetails {        
        key:string,
        projectDetailId: number;
        rank: number;
        description: string | null;
        afterImage: string | null;
        beforeImage:string | null;
        video:string | null;
        files: uploadfile[] | null;
      }

      export interface uploadfile{
        uri:string,
        type: string;
        name: string;
      }


      export interface User{
        userId : number,
        userName: string,
        email: string,
        userType: string
        licenseNumber: string,
        phoneNumber: string,
        authProvider:string,
        zipCode:string;
      }
    

    
  