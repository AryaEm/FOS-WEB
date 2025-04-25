export interface IMenu {
    id: number,
    uuid: string,
    name: string,
    price: number,
    picture: string,
    description: string,
    category: string
    createdAt: string,
    updatedAt: string
}

export interface IUser {
    id: number,
    uuid: string,
    name: string,
    email: string,
    password: string,
    profile_picture: string,
    role: string
    createdAt: string,
    updatedAt: string
}

export interface ICustomer {
    customer: string,
    table_number: string,
    payment_method: string
}

export interface IMenuCategory {
    category: string
}

export interface ICartItem {
    id: number;
    uuid: string;
    name: string;
    price: number;
    category: string;
    picture: string;
    description: string;
    quantity: number;
    note?: string;
}

export interface ITotalMenu {
    total: string
}

export interface IFavouriteMenu {
    menu: IMenu;
    totalOrdered: number;
}

export interface ITransactionHistory {
    id: number
    total_price: number
    status: string
    quantity: number
    orderList: {
        Item: string | null,
        quantity: number | null
    }[] // ✅ Alternatif yang lebih ringkas
}

export interface ITopThree {
    menu: IMenu;
    totalOrdered: number;
}