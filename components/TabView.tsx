import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import OverView from './OverView';
import Campaign from './Campaign';
import FAQ from './FAQ';
import Reward from './Rewards';

const { width } = Dimensions.get('window');
const tabs = ['OVERVIEW', 'CAMPAIGN', 'FAQ', 'REWARDS'];

export default function TabView({ route, project }: any) {
  const { projectId } = route.params;
  const [selectedTab, setSelectedTab] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleTabPress = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setSelectedTab(index);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / width);
    if (index !== selectedTab) {
      setSelectedTab(index);
    }
  };

  useEffect(() => {
    console.log('Project ID:', projectId);
  }, [projectId]);

  return (
    <>
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity key={tab} onPress={() => handleTabPress(index)} style={styles.tab}>
            <View style={styles.tabInner}>
              <Text style={[styles.tabText, selectedTab === index && styles.tabTextSelected]}>
                {tab}
              </Text>
              {selectedTab === index && <View style={styles.underline} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.page}>
          {selectedTab === 0 && <OverView project={project} />}
        </View>
        <View style={styles.page}>
          {selectedTab === 1 && <Campaign project={project} />}
        </View>
        <View style={styles.page}>
          {selectedTab === 2 && <FAQ />}
        </View>
        <View style={styles.page}>
          {selectedTab === 3 && <Reward />}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    paddingVertical: 12,
  },
  tabText: {
    color: '#000',
  },
  tabTextSelected: {
    color: '#4A5CFF',
    fontWeight: 'bold',
  },
  underline: {
    height: 2,
    backgroundColor: '#4A5CFF',
    marginTop: 4,
  },
  page: {
    width: width,
    padding: 20,
  },
});
