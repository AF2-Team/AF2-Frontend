import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import FollowerItem, { FollowerData } from './FollowerItem'; 


const INITIAL_MOCK_FOLLOWERS: FollowerData[] = [
    { 
        id: '1', 
        username: 'nightingale_writer', 
        displayName: 'La pluma oscura', 
        bio: 'Especializada en fanfics de fantasía oscura y angst.',
        avatarUrl: 'https://picsum.photos/seed/fanfic-1/100/100', 
        isFollowing: true, 
    },
    { 
        id: '2', 
        username: 'celestial_muse', 
        displayName: 'Museo Cósmico 🌙', 
        bio: 'Escribiendo historias de ciencia ficción y romance épico desde 2018.',
        avatarUrl: null, 
        isFollowing: false, 
    },
    { 
        id: '3', 
        username: 'dragonheart_art', 
        displayName: 'Artista del Reino Perdido', 
        bio: 'Principalmente fanart y worldbuilding original. ¡No me pidan fics!',
        avatarUrl: 'https://picsum.photos/seed/fanfic-3/100/100',
        isFollowing: true,
    },
];


export interface FollowersListComponentProps {
    userId: string; 
}

const FollowersListComponent: React.FC<FollowersListComponentProps> = ({ userId }) => {
    
    //Estado local para simular la lista de seguidores y sus estados
    const [followers, setFollowers] = useState<FollowerData[]>(INITIAL_MOCK_FOLLOWERS);

    //Función para manejar el cambio de estado de seguimiento
    const handleToggleFollow = (targetUserId: string) => {
        // Aquí se haría la llamada a la API
        
        setFollowers(prevFollowers => 
            prevFollowers.map(follower => 
                follower.id === targetUserId 
                    ? { ...follower, isFollowing: !follower.isFollowing } // Cambia el estado booleano
                    : follower
            )
        );
    };


    return (
        <View style={styles.listContainer}>
            <FlatList
                data={followers}
                keyExtractor={(item) => item.id}
                //Pasar la función de manejo y los datos
                renderItem={({ item }) => (
                    <FollowerItem 
                        follower={item} 
                        onToggleFollow={handleToggleFollow}
                    />
                )}
                //Deshabilitar el scroll interno 
                scrollEnabled={false} 
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListFooterComponent={() => (
                    <Text style={styles.footerText}>-- {followers.length} Seguidores mostrados --</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
    },
    separator: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginVertical: 5,
    },
    footerText: {
        textAlign: 'center',
        padding: 20,
        color: '#BDBDBD',
        fontSize: 12,
    }
});

export default FollowersListComponent;