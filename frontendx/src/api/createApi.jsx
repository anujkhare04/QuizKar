import axiosInstance from "../axios/axiosinstance";



 export const Createquiz=async(data)=>{
   
  console.log(data);
  

   try {
     let res=await axiosInstance.post('/quiz/create',data)

    if(res){
     
        console.log("Quiz created");
           return res.data; 
         
    }
   } catch (error) {
     console.log("error in creating quiz", error);
      throw error;
   }

}

export const getcategory=async(cat)=>{
   
  console.log(cat);
  

   try {

       const encodedCat = encodeURIComponent(cat);

    let res = await axiosInstance.get(`/quiz/categories/${encodedCat}`);

    if(res){
     
        console.log("get category",res);
           return res.data; 
         
    }
   } catch (error) {
     console.log("error in getting category", error);
      throw error;
   }

}

export const getAllCategories = async () => {
  try {
    const res = await axiosInstance.get("/quiz/categories");
    return res.data; 
  } catch (err) {
    console.error("Error fetching categories", err);
    throw err;
  }
};

