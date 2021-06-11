import React from 'react';
import MText from './MText';
import CartItem from './CardItem';

const FetchingError = (props) => {
    return (
        <CartItem style={{
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            borderTopWidth: 0,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
        }}>
            <MText size={16}>
                {props.children}
            </MText>
        </CartItem>
    )
}

export default FetchingError
