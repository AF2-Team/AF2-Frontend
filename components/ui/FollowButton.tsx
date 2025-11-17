import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FollowButtonProps {
    isFollowing: boolean;
    onPress: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ isFollowing, onPress }) => {
    
    const buttonText = isFollowing ? 'Siguiendo' : 'Seguir';
    
   
    const containerStyle = isFollowing 
        ? styles.followingButton 
        : styles.followButton;

    const textStyle = isFollowing 
        ? styles.followingText 
        : styles.followText;

    return (
        <TouchableOpacity style={containerStyle} onPress={onPress}>
            <Text style={textStyle}>{buttonText}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    followButton: {
        backgroundColor: '#1E88E5', 
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 15,
    },
    followText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    followingButton: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 15,
        borderWidth: 1,
        borderColor: '#BDBDBD',
    },
    followingText: {
        color: '#423646',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default FollowButton;