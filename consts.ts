import type { Country } from '~/types'
import { TransportMode } from '~/types'

export const Uk = {
    id: 2,
    code: 'UK',
    name: 'United Kingdom',
    img: '',
    eta: [
      {
        type: TransportMode.FREIGHT,
        time: '3 days'
      },
      {
        type: TransportMode.SHIP,
        time: '3 weeks'
      },
    ],
    address: {
      full_address: 'Taimbo Cargo <br> 181 Deptford <br> High Street <br> London <br> SE8 3NTa',
      address_breakdown: {
        postcode: 'SE8 3NT',
        short_address: '181 Deptford <br>  High Street <br> London SE8 3NTa',
        city: 'London',
        state: 'England',
        country: 'United Kingdom'
      }
    }
}

export  const China = {
    id: 2,
    code: 'CHINA',
    name: 'China',
    img: '',
    eta: [
      {
        type: TransportMode.FREIGHT,
        time: '7 days'
      },
      {
        type: TransportMode.SHIP,
        time: '6 weeks'
      },
    ],
    address: {
      full_address: '广州市越秀区广园西路218号盈富商贸城C区069-071档 <br> Shop C069-071 , Ying Fu building ,  No.218 Guang Yuan Xi Rd, Yue Xiu District <br> GuangZhou',
      address_breakdown: {
        postcode: '510000',
        short_address: 'Shop C069-071 , Ying Fu building <br>  No.218 Guang Yuan Xi Rd, Yue Xiu District <br> GuangZhou',
        city: 'Guangzhou',
        state: 'Guangdong',
        country: 'China'
      }
    }
}

export const Us = {
    id: 1,
    code: 'US',
    name: 'United States',
    img: '',
    eta: [
      {
        type: TransportMode.FREIGHT,
        time: '7 days'
      },
      {
        type: TransportMode.SHIP,
        time: '6 weeks'
      },
    ],
    address: {
      full_address: '6261 South Highway 6S <br> Houston Texas 77083 <br> United states of America',
      address_breakdown: {
        postcode: '77083',
        short_address: '6261 South Highway 6S <br> Houston Texas 77083',
        city: 'Houston',
        state: 'Texas',
        country: 'United states of America'
      }
    }
}

export const CountryAddresses: Country[] = [
    Us,
    Uk,
    China
]