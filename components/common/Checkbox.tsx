import { ReactElement } from "react";
import { BiMoney } from "react-icons/bi";

interface CallbackProps {
    value: string;
    checked: boolean
}

interface CheckboxProps {
    title: string;
    description: string;
    name: string;
    value: string;
    icon?: ReactElement;
    callback: ({ value, checked }: CallbackProps) => void;
}

export const Checkbox = ({ title, description, name, value, icon, callback }: CheckboxProps) => {

    const handleChange = (e: any) => {
        callback({ value: value, checked: e.target.checked });
    }

    return (
        <li className="max-w-sm">
            <input type="checkbox" id={value} name={name} value={value} className="hidden peer" onChange={handleChange} />
            <label htmlFor={value} className="inline-flex items-center justify-around w-full p-5 h-full
             text-stone-500 bg-white border border-stone-200 rounded-lg cursor-pointer
             peer-checked:border-gold-900 peer-checked:bg-gold-500 peer-checked:text-white hover:text-stone-600 hover:bg-stone-100">
                <div className="">
                    <div className="flex-grow w-full text-sm lg:text-lg font-semibold">{title}</div>
                    <div className="w-full text-sm lg:text-md">{description}</div>
                </div>
                <div className="flex flex-grow justify-end">{icon ? icon : <BiMoney />}</div>
            </label>
        </li>
    )
}