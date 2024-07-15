import { format } from 'date-fns';

// utils.ts
export const isNullOrEmpty = (str: string | null | undefined): boolean => {
    return !str || str.trim().length === 0;
  };
  
  export const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };


  export const formatDate = (dateString: string, dateFormat: string = 'MM/dd/yyyy'): string => {
    const date = new Date(dateString);
    return format(date, dateFormat);
  };
