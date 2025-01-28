const BASE_URL =  "http://localhost:8000/api/v1";

//const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const apiService = {
    async registerUser(formData) {
        try {
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: "POST",
                credentials: "include", // Sends cookies with the request
                body: formData, // FormData object for file uploads
            });
            console.log(response)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Registration failed";
        }
    },

    async loginUser({ email, enroll, password }) {
        try {
            const response = await fetch(`${BASE_URL}/users/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, enroll, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Login failed";
        }
    },

    async logoutUser() {
        try {
            const response = await fetch(`${BASE_URL}/users/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Logout failed");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Logout failed";
        }
    },

    async refreshAccessToken() {
        try {
            const response = await fetch(`${BASE_URL}/users/refresh-token`, {
                method: "POST",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to refresh token");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to refresh token";
        }
    },

    async changeCurrentPassword(oldPassword, newPassword) {
        try {
            const response = await fetch(`${BASE_URL}/users/change-password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to change password");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to change password";
        }
    },

    async getCurrentUser() {
        try {
            const response = await fetch(`${BASE_URL}/users/current-user`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch user");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to fetch user";
        }
    },

    async updateAccountDetails(fullName, email) {
        try {
            const response = await fetch(`${BASE_URL}/users/update-account`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fullName, email }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update details");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to update details";
        }
    },

    async updateAvatar(file) {
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await fetch(`${BASE_URL}/users/avatar`, {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update avatar");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to update avatar";
        }
    },

    async getWatchHistory() {
        try {
            const response = await fetch(`${BASE_URL}/users/history`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch history");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to fetch history";
        }
    },
    async getAllUserInfo() {
        try {
            const response = await fetch(`${BASE_URL}/users//all-user-info`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch user");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to fetch user";
        }
    },
    
};

export default apiService;
