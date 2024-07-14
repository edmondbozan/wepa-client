// utils.ts
export const isNullOrEmpty = (str: string | null | undefined): boolean => {
    return !str || str.trim().length === 0;
  };
  
  export const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };