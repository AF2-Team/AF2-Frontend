import React from 'react';
import { View, type ViewProps } from 'react-native';
import { styled } from 'styled-components/native';

type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

interface IVContainerProps {
    direction?: 'row' | 'column';
    bgColor?: string;
    align?: AlignItems;
    justify?: JustifyContent;
    flex?: number;
    gap?: string;
}
interface IContainerProps extends IVContainerProps, ViewProps {}

const Container = ({ children, ...rest }: IContainerProps) => {
    return <VContainer {...rest}>{children}</VContainer>;
};

const VContainer = styled(View)<IVContainerProps>`
    background-color: ${(props) => props.bgColor ?? 'transparent'};
    flex-direction: ${(props) => props.direction ?? 'column'};
    align-items: ${(props) => props.align ?? 'flex-start'};
    justify-content: ${(props) => props.justify ?? 'flex-start'};
    flex: ${(props) => props.flex ?? 1};
    ${(props) => props.gap && `gap: ${props.gap};`}
`;

export default Container;
