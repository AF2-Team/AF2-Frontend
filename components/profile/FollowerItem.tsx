import React from 'react';
import { View, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import ProfilePicture from './ProfilePicture'; 
import FollowButton from '../ui/FollowButton'; 


export interface FollowerData {
    id: string; 
    username: string; 
    displayName: string; 
    bio: string;
    avatarSource: ImageSourcePropType | null;
    // Propiedad de estado real del usuario
    isFollowing: boolean; 
}

export interface FollowerItemProps {
    follower: FollowerData;
    //Función para manejar la lógica de seguimiento (pasada desde el FlatList)
    onToggleFollow: (userId: string) => void;
}

const FollowerItem: React.FC<FollowerItemProps> = ({ follower, onToggleFollow }) => {
    
    // Función simple para envolver la llamada al padre
    const handlePress = () => {
        onToggleFollow(follower.id); 
    };

    return (
        <View style={styles.container}>
            <ProfilePicture 
                source={follower.avatarSource} 
                size={50}
                borderWidth={1}
            />
            
            <View style={styles.textContainer}>
                <Text style={styles.displayName}>{follower.displayName}</Text>
                <Text style={styles.username}>@{follower.username}</Text>
                <Text style={styles.bio} numberOfLines={1}>{follower.bio}</Text>
            </View>

            <FollowButton 
                isFollowing={follower.isFollowing}
                onPress={handlePress}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF', 
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    displayName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#423646', 
    },
    username: {
        fontSize: 12,
        color: '#616161',
        marginBottom: 2,
    },
    bio: {
        fontSize: 12,
        color: '#757575',
    },
});

export default FollowerItem;