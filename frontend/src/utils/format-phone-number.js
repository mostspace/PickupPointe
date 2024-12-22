export function removeCountryCode(phone) {
    return phone?.replace(/^\+1\s*/, ''); // Removes '+1 ' from the start of the string
}

export function formatPhoneNumber(phone) {
    // Use a regular expression to extract the digits
    const matches = phone.match(/(\d{3})\D*(\d{3})\D*(\d{4})/);

    if (matches) {
        // Format the phone number
        return `+1 ${matches[1]} ${matches[2]} ${matches[3]}`;
    }

    return null; // Return null if the input is invalid
}