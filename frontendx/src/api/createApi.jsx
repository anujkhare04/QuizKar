import axiosInstance from "../axios/axiosinstance";



export const Createquiz = async (data) => {

  console.log(data);


  try {
    let res = await axiosInstance.post('/quiz/create', data)

    if (res) {

      console.log("Quiz created");
      return res.data;

    }
  } catch (error) {
    console.log("error in creating quiz", error);
    throw error;
  }

}


export const getcategory = async (cat) => {

  console.log(cat);


  try {

    const encodedCat = encodeURIComponent(cat);

    let res = await axiosInstance.get(`/quiz/categories/${encodedCat}`);

    if (res) {

      console.log("get category", res);
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

export const Aiques = async (data) => {
  try {
    const res = await axiosInstance.post("/quiz/Aiques", data);
    return res.data;
  } catch (error) {
    console.error("Error in AI Assistance", error);
    throw error;
  }
}

export const AiquesFromFile = async (formData) => {
  try {
    const res = await axiosInstance.post("/quiz/Aiques/file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error in AI file assistance", error);
    throw error;
  }
};

export const generateMockTestTopic = async (userTopic) => {
  try {
    const res = await axiosInstance.post("/quiz/mock-test/topic", { userTopic });
    return res.data;
  } catch (error) {
    console.error("Error generating mock test topic", error);
    throw error;
  }
};

export const evaluateMockTest = async (data) => {
  try {
    const res = await axiosInstance.post("/quiz/mock-test/evaluate", data);
    return res.data;
  } catch (error) {
    console.error("Error evaluating mock test", error);
    throw error;
  }
};
