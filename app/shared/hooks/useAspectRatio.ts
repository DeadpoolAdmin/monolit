const useAspectRatio = (width: number) => {
    const getDimensions = () => {
       const height = (width / 16) * 9;
       return { width, height };
     };
    
 
    return { getDimensions }
 };
 
 
 export default useAspectRatio