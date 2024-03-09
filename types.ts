export interface Country {
    id: number,
    code: string,
    name: string,
    img: string,
    address: Address
}

export interface Address {
    full_address: string,
    address_breakdown: AddressBreakDown
}

export interface AddressBreakDown {
    short_address: string,
    city: string,
    state: string,
    postcode: string,
    country: string
}