
async function fetchApplicationData(apiUrl, type, offset, limit) {
    console.log('^^^^^^working')
    const url = `` +
        // apiUrl + 
        `?type=${type}&offset=${offset}&limit=${limit}`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "accept": "*/*"
        }
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return res.json();
}

// Fetches all the data
export async function fetchAll(apiUrl, offset = 4, limit = 4) {

    const activeData = await fetchApplicationData(apiUrl, 'active', 4, 4);
    const inactiveData = await fetchApplicationData(apiUrl, 'inactive', 4, 4);

    return { activeData, inactiveData, fetchedAt: Date };
}
