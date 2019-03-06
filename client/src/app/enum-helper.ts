export class EnumHelpers {
    /**
    * No instances guard.
    */
    private constructor() { }
    /**
    * Check to numeral enumeration.
    */
    private static isNumeral(enumType: object) {
        const members = Object.keys(enumType);
        if (!members.some((x) => true)) {
            throw new TypeError("Invalid enumeration type.");
        }
        let parsedCount = 0;
        members.forEach((x) => {
            const parsedValue = parseInt(x, 10);
            if (!Number.isNaN(parsedValue)) {
                parsedCount++;
            }
        });
        return parsedCount === members.length / 2;
    }
    /**
    * Get all keys from enumeration.
    */
    public static keys(enumType: object) {
        const members = Object.keys(enumType);
        let keys: string[];
        if (!EnumHelpers.isNumeral(enumType)) {
            keys = members;
        } else {
            keys = [];
            members.forEach((x) => {
                const parsedValue = parseInt(x, 10);
                if (Number.isNaN(parsedValue)) {
                    keys.push(x);
                }
            });
        }
        // key of enumeration can't be number      
        return keys.filter((x) => Number.isNaN(parseInt(x, 10)));
    }
}