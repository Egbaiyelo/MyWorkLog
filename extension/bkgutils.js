
async function fetchApplicationData(apiUrl, type, offset, limit) {
    const url = `https://td.wd3.myworkdayjobs.com/wday/cxs/td/TD_Bank_Careers/applications` +
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
export async function fetchAllAplications(apiUrl, offset = 0, limit = 4) {

    const activeData = await fetchTab('active');
    const inactiveData = await fetchTab('inactive');
    const now = new Date();

    async function fetchTab(type) {
        let response = await fetchApplicationData(apiUrl, type, offset, limit);
        let data = response.data;
        offset += limit;

        while (response.total > offset) {
            
            let extraData = await fetchApplicationData(apiUrl, type, offset, limit);
            data.push(...extraData.data)
            console.log(data)
            offset += limit;
        }
        return data;
    }

    console.log("Here(((((((((((((99999")
    console.log({ activeData, inactiveData, fetchedAt: now.toLocaleString() })
    return { activeData, inactiveData, fetchedAt: now.toLocaleString() };
}



