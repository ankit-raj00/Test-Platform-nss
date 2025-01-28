export const getTestDetail = async ({ id }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/test/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching test detail:", error);
      throw error;
    }
  };
  
  export const uploadResponse = async ({ payload }) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/response", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error("Error uploading response:", error);
      throw error;
    }
  };
  export const getResponse = async ({ id }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/response/${id}`, {
        method: "GET",
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error uploading response:", error);
      throw error;
    }
  };  
  export const computeResult = async ({ id }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/result/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error computing result:", error);
      throw error;
    }
  };
  
  export const getAllTestDetails = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/test/");
      return await response.json();
    } catch (error) {
      console.error("Error fetching all test details:", error);
      throw error;
    }
  };
  
  export const deleteQuestion = async ({ questionId }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/question/${questionId}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  };
  
  export const deleteTest = async ({ id }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/test/${id}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting test:", error);
      throw error;
    }
  };
  
  export const updateTest = async ({ id, test }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/test/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(test),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating test:", error);
      throw error;
    }
  };
  
  export const updateQuestion = async ({ question , id }) => {
    try {
      console.log(question)
      const response = await fetch(`http://localhost:8000/api/v1/question/${id}`, {
        method: "PUT",
        
        body: question,
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  };
  
  export const createTest = async ({ test }) => {
    try {
     
      console.log(test)
      const response = await fetch("http://localhost:8000/api/v1/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(test),
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating test:", error);
      throw error;
    }
  };
  
  export const createQuestion = async ({ formData }) => {
    try {
      console.log("test" , formData )
      const response = await fetch("http://localhost:8000/api/v1/question", {
        method: "POST",
        
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  };
  


  export const toggleBookmark = async ({ questionId }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/bookmark/toggle/${questionId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
    }
  };
  
  export const getUserBookmarks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/bookmark/user", {
        method: "GET",
        credentials: "include",
      });
      return await response.json();
      
    } catch (error) {
      console.error("Error fetching user bookmarks:", error);
      throw error;
    }
  };
  
  export const getQuestionBookmarkUsers = async ({ questionId }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/bookmark/question/${questionId}`, {
        method: "GET",
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching bookmark users for question:", error);
      throw error;
    }
  };
  
 
  

  export default {
    getTestDetail,
    uploadResponse,
    computeResult,
    getAllTestDetails,
    deleteQuestion,
    deleteTest,
    updateTest,
    updateQuestion,
    createTest,
    createQuestion,
    toggleBookmark,
    getUserBookmarks,
    getQuestionBookmarkUsers,
  };
  