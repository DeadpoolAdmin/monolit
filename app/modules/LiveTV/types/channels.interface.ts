export interface IChannels {
    number: number
    epg_id?: string | null
    id: number | string
    organization_id?: number
    image: string
    category_name?: string
    name: string
    tv_categories?: {
        id: number
        tv_categories_id: number
        tv_channels_id: number
    }[]
    udp_url?: string
    url?: string
    icon: string,
    stream_id?: number // For Xtream channels
    type?: string // For channel type (Xtream)
    category_id?: number | string
}


export interface IChannelsApi {
    channelNumber: number
    image: string
    _id: string
    language: string
    orgId: number
    title: string
    url: string
    category: Record<string, {
        channels: IChannels[]
        description: string
        _id: string
        title: string
    }>[]
}




export interface IXtreamChannels {
    id: number,
    category_id: number,
    name: string,
    stream_id: number,
    stream_type: string,
    url: string,
    stream_icon: string
}
