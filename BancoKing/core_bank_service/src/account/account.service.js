import { Account } from './account.model.js';
import axios from 'axios';

export const register = async (accountData, token) => {
    try {
        // Consultar el microservicio de .NET para verificar el usuario
        const dotnetUrl = `http://localhost:5288/api/v1/user/${accountData.userId}`;

        const response = await axios.get(dotnetUrl, {
            headers: { 'Authorization': token }
        });

        const userFromDotNet = response.data;

        // Validar que el usuario exista y esté activo en .NET
        if (!userFromDotNet) throw new Error('Usuario no encontrado en el sistema central.');
        if (userFromDotNet.status !== true) throw new Error('El usuario está inactivo en .NET.');

        return await Account.create(accountData);
    } catch (error) {
        if (error.response) {
            throw new Error(`.NET Response: ${error.response.data.message || 'Usuario inválido'}`);
        }
        throw error;
    }
};

export const getAll = async () => {
    return await Account.findAll();
};