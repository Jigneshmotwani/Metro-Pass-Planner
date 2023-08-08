import axios from "axios";

const baseUrl = "http://localhost:4000/";

// changed validateUser
export const validateUser = async (token) => {
    const res = await axios.post(`${baseUrl}api/users/login`, {}, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    return res.data;
}