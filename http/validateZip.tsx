import { BASE_URL } from "@/constants/Endpoints";
import fetchWithAuth from "@/context/FetchWithAuth";
import { User } from "@/interfaces/IProject";

export const validateZip = async (zip: string): Promise<boolean> => {
    try {
        const url = `${BASE_URL}/api/utility/zips/${zip}`;
        const response = await fetch(url);

        if (response.ok) {
            return true;
        } else{
            return false;
        }
     } catch (error) {
        console.log("error");
        return false;
    }
};