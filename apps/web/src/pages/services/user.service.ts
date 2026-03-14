const API_URL = "http://localhost:3000/api";

export async function getUsers() {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
}

export async function deleteUser(userId: string) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
    });
    return response.json();
}
