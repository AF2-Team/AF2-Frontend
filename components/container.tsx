import React from 'react';
import { View, type ViewProps } from 'react-native';
import { styled } from 'styled-components/native';

interface IVContainerProps {
    direction?: string;
}
interface IContainerProps extends IVContainerProps, ViewProps {}

const Container = ({ children, ...rest }: IContainerProps) => {
    return <VContainer {...rest}>{children}</VContainer>;
};

const VContainer = styled(View)<IVContainerProps>`
    background-color: ${(props) => props.theme.PALLETE.white};
    flex: 1;
    justify-content: 'center';
    align-items: 'center';
`;

export default Container;
