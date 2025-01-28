const BASE_URL = "http://localhost:8000/api/v1/admins";

const adminService = {
    async registerAdmin(formData) {
        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                credentials: "include", // Sends cookies with the request
                body: formData, // FormData object for file uploads
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Registration failed";
        }
    },

    async loginAdmin({ email, enroll, password }) {
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, enroll, password }),
            });
            
            if (!response.ok) {
                const errorData = await response.json(); // Parse the JSON error response
           
            throw new Error(errorData.message || "Login failed");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Login failed";
        }
    },

    async logoutAdmin() {
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
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
            const response = await fetch(`${BASE_URL}/refresh-token`, {
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

    async changeAdminPassword(oldPassword, newPassword) {
        try {
            const response = await fetch(`${BASE_URL}/change-password`, {
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

    async getCurrentAdmin() {
        try {
            const response = await fetch(`${BASE_URL}/current-admin`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch admin");
            }
            return await response.json();
        } catch (error) {
            throw error.message || "Failed to fetch admin";
        }
    },

    async updateAdminDetails(fullName, email) {
        try {
            const response = await fetch(`${BASE_URL}/update-account`, {
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

            const response = await fetch(`${BASE_URL}/avatar`, {
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
};

export default adminService;
