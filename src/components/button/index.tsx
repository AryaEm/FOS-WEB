import { ReactNode } from "react"

type Props = {
    children: ReactNode
    type: "button" | "submit" | "reset",
    onClick?: () => void
    className?: string
}

export const ButtonSuccess = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-teal-500 text-white rounded-md py-2 px-4 transition-all duration-300 hover:bg-teal-700 font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}


export const ButtonWarning = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-teal-500 text-white rounded-md py-2 px-4 hover:bg-teal-600 font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}


export const ButtonDanger = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-red-600 text-white border border-red-600 rounded-md py-2 px-4 hover:bg-red-700 font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}


export const ButtonSuccesOutline = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-white text-green-600 border border-green-600 rounded-md py-2 px-4 hover:bg-green-600 transition-all duration-300 hover:text-white font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}


export const ButtonDangerOutline = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-white text-red-600 border border-red-600 rounded-md py-2 px-4 hover:bg-red-600 transition-all duration-300 hover:text-white font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}


export const ButtonInfoOutline = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-white text-teal-500 border border-teal-500 rounded-md bg-opacity-80 py-2 px-4 hover:bg-teal-500 transition-all duration-300 hover:text-white font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}


export const ButtonReset = ({ children, type, onClick, className }: Props) => {
    return (
        <button className={`text-sm bg-transparent text-red-600 border border-red-600 rounded-md bg-opacity-80 py-2 px-4 hover:bg-red-600 transition-all duration-300 hover:text-white font-bold ${className}`}
            type={type} onClick={() => { if (onClick) onClick() }}>
            {children}
        </button>
    )
}
