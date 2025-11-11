import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View, Image, ScrollView, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { axiosInstance } from '../../lib/axios';

export default function Asset() {
        const { id } = useLocalSearchParams();
        const router = useRouter();
        const qc = useQueryClient();

        const { data: asset, isLoading, isError, error } = useQuery({
                queryKey: ["asset", id],
                queryFn: async () => {
                        const res = await axiosInstance.get(`/asset/${id}`);
                        return res.data;
                },
                enabled: !!id,
        })

        async function handleDelete() {
            Alert.alert(
                'Delete asset',
                'Are you sure you want to delete this asset?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: async () => {
                            try {
                                await axiosInstance.delete(`/asset/${id}`);
                                // invalidate assets list and go back
                                qc.invalidateQueries(['assets']);
                                router.back();
                            } catch (err) {
                                Alert.alert('Error', err?.response?.data?.message || err.message || 'Failed to delete');
                            }
                    } }
                ]
            )
        }

        if (isLoading) return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        )

        if (isError) return (
            <View style={styles.center}>
                <Text>Error loading asset: {error?.message}</Text>
            </View>
        )

        const formatDate = (d) => {
            if (!d) return '—';
            try { return new Date(d).toLocaleDateString(); } catch { return d }
        }

        return (
            <ScrollView contentContainerStyle={styles.container}>
                {asset?.assetImage ? (
                    <Image source={{ uri: asset.assetImage }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholder]}>
                        <Text style={styles.placeholderText}>{asset?.name?.charAt(0) || '?'}</Text>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.name}>{asset?.name}</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Last service:</Text>
                        <Text style={styles.value}>{formatDate(asset?.lastService)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Next service:</Text>
                        <Text style={styles.value}>{formatDate(asset?.nextService)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Responsible:</Text>
                        <Text style={styles.value}>{asset?.responsible_user.name || 'Unassigned'}</Text>
                    </View>

                    <View style={styles.actions}>
                        <Pressable style={[styles.button, styles.edit]} onPress={() => router.push(`/CreateAsset?editId=${id}`)}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </Pressable>

                        <Pressable style={[styles.button, styles.delete]} onPress={handleDelete}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        )
}

const styles = StyleSheet.create({
    container: {
        padding: 0,        
        alignItems: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        position: "fixed",
        width: '100%',
        height: '90%',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#eee'
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    placeholderText: {
        fontSize: 48,
        color: '#666'
    },
    card: {
        position: "fixed",
        bottom: "0",
        margin: 30,
        width: '95%',
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: "#f7f7f7",
        borderWidth: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    label: {
        color: '#666'
    },
    value: {
        fontWeight: '600'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    edit: {
        backgroundColor: '#1f6feb',
        marginRight: 8
    },
    delete: {
        backgroundColor: '#ff4d4f'
    },
    buttonText: {
        color: 'white',
        fontWeight: '600'
    }
})
