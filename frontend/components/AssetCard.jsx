import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios.js';
import Toast from 'react-native-toast-message';

export default function AssetCard({ asset }) {
  const queryClient = useQueryClient();

  const { mutate: deleteAsset } = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/asset/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      Toast.show({
        type: 'success',
        text1: 'Successfully deleted asset',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Something went wrong',
      });
    },
  });

  function handleDelete(id) {
    deleteAsset(id);
  };

  function getStatus(asset) {
    if (!asset?.nextService) return 0;

    const nextServiceDate = new Date(asset.nextService);
    const today = new Date();

    // 14 days in milliseconds
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;

    // If service date is before today → overdue
    if (nextServiceDate < today) {
      return "Overdue"; // overdue
    }

    // If service date is within 14 days from today → upcoming
    if (nextServiceDate - today <= fourteenDays) {
      return "Upcoming"; // upcoming
    }

    // Otherwise → ok
    return "OK"; // ok
  }


  return (
    <View style={styles.container}>

      <Text style={[
        getStatus(asset) === "Overdue" && styles.overdue,
        getStatus(asset) === "Upcoming" && styles.upcoming,
        getStatus(asset) === "OK" && styles.ok]}>
          {getStatus(asset)}
      </Text>

      <View style={{ display: "flex", flexDirection: "column" }}>
        <Text style={styles.title}>{asset.name}</Text>
        <Text style={styles.subtitle}>{asset.responsible_user?.name}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => console.log("EDIT")} // todo: Add edit functionality
        >
          <Pencil color="white" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(id)}
        >
          <Trash2 color="white" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  overdue: {
    backgroundColor: '#e63946',
    padding: 8,
    borderRadius: 8,
    color:"white"
  },
  upcoming: {
    backgroundColor: '#e67e39ff',
    padding: 8,
    borderRadius: 8,
    color:"white"
  },
  ok: {
    backgroundColor: '#117623ff',
    padding: 8,
    borderRadius: 8,
    color:"white"
  },
  deleteButton: {
    backgroundColor: '#e63946',
    padding: 8,
    borderRadius: 8,
    color:"white"
  },
  editButton: {
    backgroundColor: '#ffa500',
    padding: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 4
  }
});
