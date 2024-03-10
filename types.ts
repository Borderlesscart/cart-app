export interface Country {
    id: number,
    code: string,
    name: string,
    img: string,
    address: Address
    eta: ExpectedArrivalTime[]
}

export enum TransportMode {
    SHIP = 'ship',
    FREIGHT = 'freight'
}
export interface ExpectedArrivalTime {
    type: TransportMode
    time: string
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