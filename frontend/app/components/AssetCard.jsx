import { View, Text, StyleSheet } from 'react-native';

export default function AssetCard({ name }) {
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
    </View>
  );
};

const styles = new StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: "gray",
        borderRadius: 10,
        padding: 8
    }
})
