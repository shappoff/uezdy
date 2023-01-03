import {CSSProperties, default as React} from 'react';
import Select from 'react-select';

export interface ColourOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

export const DropDownComponent = ({items, changeHandler}: any) => {

    return (
        <Select
            defaultValue={[items[2], items[3]]}
            isMulti
            name="colors"
            options={items}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={changeHandler}
        />
    );
};