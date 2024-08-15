import { BASE_URL } from "@/constants/Endpoints";
import fetchWithAuth from "@/context/FetchWithAuth";
import { User } from "@/interfaces/IProject";

export const fetchUserData = async (userId: string): Promise<User> => {
    try {
        const url = `${BASE_URL}/api/auth/users/${userId}`;
        const response = await fetchWithAuth(url);

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const result: User = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};