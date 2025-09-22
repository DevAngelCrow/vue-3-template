import { ApiResponseGeneric } from "@/core/services/interfaces/apiResponseGeneric.interface"
import { httpClient } from "@/core/utils/httpClient";

import { CountryResponse } from "../interfaces/country.response.interface"
import { CreateCountry } from "../interfaces/country.create.interface";

const getAllCountries = async (): Promise<ApiResponseGeneric<CountryResponse>>=> {

    const response = await httpClient.get<ApiResponseGeneric<CountryResponse>>(
        'catalogs/countries?page=1&per_page=10',
    );
    return response.data;
}

const createCountries = async (data: CreateCountry) => {
    const response = await httpClient.post('catalogs/countries', data);
    return response;
}


export default {
    getAllCountries,
    createCountries
}