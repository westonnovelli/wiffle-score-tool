import React from 'react';
import { Chevron } from '../icons';
import './MenuItem.css';

type AsProp<C extends React.ElementType> = {
    as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
    C extends React.ElementType,
    Props = {}
> = React.PropsWithChildren<Props & AsProp<C>>
    & Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

interface MenuItemProps {
    label: string;
    icon?: React.ReactNode;
    description?: string;
    onClick?: React.MouseEventHandler<HTMLLIElement>;
}

const MenuItem = <C extends React.ElementType = "li">({
    onClick,
    label,
    icon = <Chevron style={{ transform: 'rotate(.75turn)' }} />,
    description,
    as,
    ...props
}: PolymorphicComponentProp<C, MenuItemProps>) => {
    const Element = as || 'li';
    return (
        <Element className="menuitem" role="button" onClick={onClick} {...props}>
            <div>
                {label}
                {Boolean(description) && <span>{description}</span>}
            </div>
            {icon}
        </Element>
    );
};

export default MenuItem;
