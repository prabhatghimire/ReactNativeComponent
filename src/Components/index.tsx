import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';

// type definationipt for indivisual item
interface IndivisualItem {
  id: string;
  name: string;
}

// type defination for component props
interface MyComponentProps {
  data: Array<IndivisualItem>;
}

// debounce function to delay the search
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const MyComponent = ({data}: MyComponentProps) => {
  const [selectedItems, setSelectedItems] = useState<Array<IndivisualItem>>([]);
  const [dataSource, setDataSource] = useState<Array<IndivisualItem>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const inputRef = useRef(null);

  // handleSearch function to filter the data based on search term implemented using debounce
  const handleSearch = debounce((term: string) => {
    setDataSource(
      data.filter(item => item.name.toLowerCase().includes(term.toLowerCase())),
    );
  }, 1000);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  useEffect(() => {
    // const timeoutId = setTimeout(() => {
    //   setDataSource(data?.filter(item => item?.name?.includes(searchTerm)));
    // }, 1000);
    // need to clear the timeout when the component unmounts
    // using handleSearch function can also improve the performance
    handleSearch(searchTerm);
    // return () => {
    //   clearTimeout(timeoutId); // Clear the timeout if `searchTerm` changes before the timeout completes
    // };
  }, [searchTerm]);

  const handleSelect = (item: IndivisualItem) => {
    // if the item is already selected then remove it from the selectedItems array before it was missing
    if (selectedItems.includes(item)) {
      setSelectedItems(currentSelectedItems =>
        currentSelectedItems.filter(selectedItem => selectedItem !== item),
      );
      return;
    }
    setSelectedItems(currentSelectedItems => [...currentSelectedItems, item]);
  };

  const handleClear = () => {
    // this code ony clears the input field's value  so it will not trigger the useEffect and unable to rerender the default data
    // inputRef.current.clear();
    // this code clears the searchTerm value so it will trigger the useEffect and rerender the default data
    setSearchTerm('');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          // ref={inputRef}
          onChangeText={setSearchTerm}
          value={searchTerm}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearInput}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dataSource}
        contentContainerStyle={styles.contentListContainer}
        keyExtractor={item => item.id}
        initialNumToRender={10}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={styles.contentContainer}>
            <Text style={styles.contentName}>{item?.name}</Text>
            <Text style={styles.contentSelectedIndicator}>
              {selectedItems.includes(item) ? 'Selected' : 'Not selected'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MyComponent;

const styles = StyleSheet.create({
  contentContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  contentListContainer: {paddingVertical: 20},
  contentSelectedIndicator: {fontSize: 16, color: 'gray'},
  contentName: {fontSize: 20},
  mainContainer: {flex: 1, paddingHorizontal: 10},
  clearInput: {color: 'red'},
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    // margin: 10,
    flex: 1,
  },
});
