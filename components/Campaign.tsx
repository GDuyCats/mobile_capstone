import React from 'react';
import { View, Text, useWindowDimensions, StyleSheet, ScrollView } from 'react-native';
import RenderHTML from 'react-native-render-html';

export default function Campaign({ project }: any) {
  const { width } = useWindowDimensions();

  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <RenderHTML
        contentWidth={width}
        source={{ html: project.story || '<p>There is no story</p>' }}
        renderersProps={{
          img: {
            enableExperimentalPercentWidth: true,
          },
        }}
        tagsStyles={{
          img: {
            width: width * 0.9,
            height: undefined,
            aspectRatio: 1.5,

          },
          p: {
            marginBottom: 10,
            lineHeight: 22,
            fontSize: 15,
            color: '#333',
          },
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#00246B',
  },
});
