export namespace PRIMITIVE {

    export const getAllKeys = () => {
        return {
            all_keys: {}
        };
    };

    export type GetAllKeysResponse = string[];

    export const getValue = (key: string) => {
        return {
            get_value: {
                key: key
            }
        }
    }
    export type DecimalResponse = { decimal: string }
    export type StringResponse = { string: string }
    export type UintResponse = { uint128: string }
    export type GetValueResponse = { key: string, value: DecimalResponse | StringResponse | UintResponse }


    export const isStringValueResponse = (value: GetValueResponse['value']) => {
        return "string" in value;
    }

}

