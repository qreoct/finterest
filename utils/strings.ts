export const prepareStringsForJSON = (str: string) => {
    return str.replace(/"/g, '\\"').replace(/'/g, "\\'");
}