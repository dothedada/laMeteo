const getIPlocation = async () => {
    try {
        const ipAPI = await fetch('http://ip-api.com/json/', { mode: 'cors' })
		const response = await ipAPI.json()
		return response.city
    } catch {
        return 'Bogotá';
    }
};

console.log(getIPlocation())
