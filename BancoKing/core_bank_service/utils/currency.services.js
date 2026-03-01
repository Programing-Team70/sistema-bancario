import axios from 'axios';

export const convertCurrency = async (amount, from = 'GTQ', to = 'USD') => {
    try {

        const url = `https://open.er-api.com/v6/latest/${from}`;
        const response = await axios.get(url);

        if (response.data && response.data.result === 'success') {
            const rate = response.data.rates[to];
            const convertedAmount = (amount * rate).toFixed(2);

            return {
                originalAmount: amount,
                convertedAmount: parseFloat(convertedAmount),
                rate: rate,
                currency: to
            };
        }
        return null;
    } catch (error) {
        console.error("Error en API externa, usando tasa estática de respaldo (1 USD = 7.80 GTQ)");
        const staticRate = 0.13;
        return {
            originalAmount: amount,
            convertedAmount: parseFloat((amount * staticRate).toFixed(2)),
            rate: staticRate,
            currency: to
        };
    }
};