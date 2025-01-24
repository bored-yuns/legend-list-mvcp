import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {LegendList} from '@legendapp/list';

const getRandomStyle = () => {
  const randomHeight = Math.random() * 100 + 100;
  return {width: '100%', height: randomHeight};
};

const colors = ['red', 'blue', 'green', 'purple', 'pink'];
const mockApi = (count = 10) => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomString = Math.random().toString(36).substring(2, 15);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = [];
      for (let i = 0; i < count; i++) {
        data.push({
          id: `${randomString}-${i}`,
          name: `item: ${i}`,
          color: randomColor,
        });
      }
      resolve(data);
    }, 1500);
  });
};

const initialData = Array.from({length: 10}, (_, i) => {
  const randomString = Math.random().toString(36).substring(2, 15);
  return {
    id: randomString,
    name: `initial data: ${i}`,
    color: 'blue',
  };
});

export const DemoContainer = () => {
  const [data, setData] = useState(initialData);

  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);

  const fetchPreviousData = async () => {
    try {
      setIsLoadingTop(true);
      const response = await mockApi(10);
      // If you prepend the data by creating a new array,
      // the list will start shifting and will not work as expected
      const newData = [...response, ...data];
      setData(newData);

      // If you prepend the data this way without creating a new array,
      // it will work as expected
      // setData(prevData => [...response, ...prevData]);
    } catch (error) {
      console.error('Error fetching previous data:', error);
    } finally {
      setIsLoadingTop(false);
    }
  };

  const fetchForwardData = async () => {
    try {
      setIsLoadingBottom(true);
      const response = await mockApi(10);
      // If you append the data by creating a new array,
      // the list will start shifting and will not work as expected
      const newData = [...data, ...response];
      setData(newData);

      // If you append the data this way without creating a new array,
      // it will work as expected
      // setData(prevData => [...prevData, ...response]);
    } catch (error) {
      console.error('Error fetching forward data:', error);
    } finally {
      setIsLoadingBottom(false);
    }
  };

  const renderItem = ({item}) => {
    const style = getRandomStyle();
    const containerStyles = {...style, ...styles.container};
    return (
      <View style={[containerStyles, {backgroundColor: item.color}]}>
        <Text style={styles.text}>{item.name}</Text>
      </View>
    );
  };

  if (data.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {isLoadingTop && (
        <View style={styles.loadingContainer}>
          <Text>Loading more items at top...</Text>
        </View>
      )}
      <LegendList
        data={data}
        onStartReached={fetchPreviousData}
        onStartReachedThreshold={0}
        onEndReached={fetchForwardData}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        estimatedItemSize={100}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        waitForInitialLayout
        maintainVisibleContentPosition
      />
      {isLoadingBottom && (
        <View style={styles.loadingContainer}>
          <Text>Loading more items at bottom...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: 'gray',
  },
});
