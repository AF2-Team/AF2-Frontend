import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, 
  ScrollView, ViewStyle } from 'react-native';
import FollowersList from './FollowersList';
import { Feed } from '../Feed';


const TABS = [
  { id: 'posts', title: 'Publicaciones' },
  { id: 'favorite', title: 'Favoritos' },
  { id: 'followers', title: 'Seguidores'},
  { id: 'following', title: 'Seguidos'},
  { id: 'about', title: 'Acerca de' },
] as const;

type TabId = typeof TABS[number]['id'];


const LOCAL_COLORS = {
  
  ACTIVE: '#BCA1BD', 
  INACTIVE: '#616161', 
  BORDER: '#E0E0E0', 
  WHITE: '#FFFFFF',
} as const;

const LOCAL_SIZES = {
  SPACING_MD: 12,
  LINE_HEIGHT: 3,
  SPACING_HORIZONTAL: 20,
} as const;

const MOCK_USER_ID = 'user-01';

export interface ProfileTabsProps {
  style?: StyleProp<ViewStyle>;
  onTabChange?: (tabId: TabId) => void;
}

const ProfileTabs = ({ style, onTabChange }: ProfileTabsProps) => {
  
  const [activeTab, setActiveTab] = useState<TabId>(TABS[0].id);

  const handleTabPress = (tabId: TabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const renderContent = () => {
    // Nota: Aquí se implementaría el componente de contenido real
    switch (activeTab) {
      case 'posts':
        return <Feed scrollEnabled={false}/>;
      case 'about':
        return <Text style={styles.contentText}>Contenido: Información Detallada del Usuario.</Text>;
      case 'followers':
        return <FollowersList userId={MOCK_USER_ID} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        style={styles.tabsBarScroll}
        contentContainerStyle={styles.tabsBarContent}
        horizontal={true}  // Habilitar scroll horizontal
        showsHorizontalScrollIndicator={false} // Ocultar la barra de desplazamiento
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.id)}
            >
              <Text 
                style={[
                  styles.tabText, 
                  { color: isActive ? LOCAL_COLORS.ACTIVE : LOCAL_COLORS.INACTIVE }
                ]}
                numberOfLines={1}
              >
                {tab.title}
              </Text>
              
              <View 
                style={[
                  styles.activeIndicator, 
                  { backgroundColor: isActive ? LOCAL_COLORS.ACTIVE : 'transparent' }
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <View style={styles.contentContainer}>
        {renderContent()} 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: LOCAL_COLORS.WHITE,
    //minHeight: 100, 
  },
  tabsBarScroll: {
    borderBottomWidth: 1,
    borderColor: LOCAL_COLORS.BORDER,
  },
  tabsBarContent: {
    //Asegura que los elementos se alineen uno al lado del otro
    flexDirection: 'row',
  },
  tabButton: {
    paddingVertical: LOCAL_SIZES.SPACING_MD,
    //El padding horizontal da espacio alrededor del texto
    paddingHorizontal: LOCAL_SIZES.SPACING_HORIZONTAL,
    alignItems: 'center',
    
    //flex: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  activeIndicator: {
    height: LOCAL_SIZES.LINE_HEIGHT,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: LOCAL_COLORS.WHITE,
  },
  contentText: {
    fontSize: 14,
    color: LOCAL_COLORS.INACTIVE,
  }
});

export default ProfileTabs;